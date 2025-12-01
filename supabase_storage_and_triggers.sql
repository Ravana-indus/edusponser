-- Storage policies and business triggers for EduSponsor (Supabase)
-- Run in Supabase SQL editor. Idempotent using DO blocks and IF checks.

-- =====================
-- Storage: uploads bucket (public) and policies
-- =====================
-- Create bucket 'uploads' if it does not exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'uploads'
  ) THEN
    PERFORM storage.create_bucket('uploads', TRUE, NULL);
  END IF;
END
$$ LANGUAGE plpgsql;

-- Enable RLS on storage.objects (should already be enabled by Supabase)
-- Define policies for uploads bucket
DO $$
BEGIN
  -- Public read access for 'uploads'
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'uploads public read'
  ) THEN
    CREATE POLICY "uploads public read" ON storage.objects
      FOR SELECT USING (
        bucket_id = 'uploads'
      );
  END IF;

  -- Authenticated users can insert into their own folder path `${uid}/...`
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'uploads auth write own folder'
  ) THEN
    CREATE POLICY "uploads auth write own folder" ON storage.objects
      FOR INSERT WITH CHECK (
        bucket_id = 'uploads'
        AND auth.role() = 'authenticated'
        AND (position((auth.uid()::text || '/') in name) = 1)
      );
  END IF;

  -- Owners can update/delete their objects
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'uploads owner modify'
  ) THEN
    CREATE POLICY "uploads owner modify" ON storage.objects
      FOR UPDATE USING (bucket_id = 'uploads' AND owner = auth.uid())
      WITH CHECK (bucket_id = 'uploads' AND owner = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'uploads owner delete'
  ) THEN
    CREATE POLICY "uploads owner delete" ON storage.objects
      FOR DELETE USING (bucket_id = 'uploads' AND owner = auth.uid());
  END IF;
END
$$ LANGUAGE plpgsql;

-- =====================
-- Business triggers: payments -> points; purchase order approvals -> deduct points
-- =====================

-- Trigger function: on completed payment, allocate points to student and add notification
CREATE OR REPLACE FUNCTION public.on_payment_completed()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF (TG_OP = 'INSERT' AND NEW.status = 'completed') THEN
    -- Allocate points if student provided
    IF NEW.student IS NOT NULL AND NEW.points IS NOT NULL THEN
      PERFORM public.allocate_points(NEW.student, NEW.points, 'payment ' || NEW.name);
    END IF;

    -- Optional: create notification for student
    INSERT INTO public.notifications(name, recipient_type, recipient, title, message, type, category, status)
    VALUES (
      'NTF-' || floor(extract(epoch from now())*1000)::text,
      'student',
      COALESCE(NEW.student, ''),
      'Payment received',
      'Payment ' || COALESCE(NEW.transaction_id, NEW.name) || ' processed.',
      'success',
      'payment',
      'unread'
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_payment_completed ON public.payments;
CREATE TRIGGER trg_payment_completed
  AFTER INSERT ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.on_payment_completed();

-- Trigger function: on purchase order approval, deduct points and notify
CREATE OR REPLACE FUNCTION public.on_purchase_order_update()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF (TG_OP = 'UPDATE' AND NEW.status = 'approved' AND COALESCE(OLD.status,'') <> 'approved') THEN
    IF NEW.student IS NOT NULL AND NEW.total_points IS NOT NULL THEN
      PERFORM public.deduct_points(NEW.student, NEW.total_points, 'purchase order ' || NEW.name);
    END IF;

    -- Notify student
    INSERT INTO public.notifications(name, recipient_type, recipient, title, message, type, category, status)
    VALUES (
      'NTF-' || floor(extract(epoch from now())*1000)::text,
      'student',
      COALESCE(NEW.student, ''),
      'Order approved',
      'Your order ' || NEW.name || ' has been approved.',
      'info',
      'order',
      'unread'
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_purchase_order_update ON public.purchase_orders;
CREATE TRIGGER trg_purchase_order_update
  AFTER UPDATE ON public.purchase_orders
  FOR EACH ROW EXECUTE FUNCTION public.on_purchase_order_update();

-- Helpful indexes if not present
CREATE INDEX IF NOT EXISTS idx_storage_objects_bucket_name ON storage.objects(bucket_id, name);
