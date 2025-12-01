'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

// Custom hook for fetching student data
export function useStudentData(studentIdentifier?: string) {
  const [student, setStudent] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStudent = async () => {
    if (!studentIdentifier || typeof window === 'undefined') return
    
    setLoading(true)
    setError(null)
    
    try {
      // Try to find by name (primary key) first, then by email
      let query = supabase
        .from('students')
        .select('*')
      
      if (studentIdentifier.includes('@')) {
        query = query.eq('email', studentIdentifier)
      } else {
        query = query.eq('name', studentIdentifier)
      }
      
      const { data, error } = await query.maybeSingle()
      
      if (error) throw error
      setStudent(data)
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching student:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudent()
  }, [studentIdentifier])

  return { student, loading, error, refetch: fetchStudent }
}

// Custom hook for fetching student goals
export function useStudentGoals(studentName?: string) {
  const [goals, setGoals] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!studentName) return

    const fetchGoals = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const { data, error } = await supabase
          .from('student_goals')
          .select('*')
          .eq('student', studentName)
          .order('created_date', { ascending: false })
        
        if (error) throw error
        setGoals(data || [])
      } catch (err: any) {
        setError(err.message)
        console.error('Error fetching goals:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchGoals()
  }, [studentName])

  const createGoal = async (goalData: {
    title: string
    description: string
    target_date: string
    status?: string
  }) => {
    if (!studentName) return null

    try {
      const { data, error } = await supabase
        .from('student_goals')
        .insert({
          student: studentName,
          title: goalData.title,
          description: goalData.description,
          target_date: goalData.target_date,
          status: goalData.status || 'active',
          created_date: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error
      
      // Add to local state for immediate feedback
      setGoals(prev => [data, ...prev])
      return data
    } catch (err: any) {
      setError(err.message)
      console.error('Error creating goal:', err)
      return null
    }
  }

  const updateGoal = async (goalName: string, updates: any) => {
    try {
      const { data, error } = await supabase
        .from('student_goals')
        .update(updates)
        .eq('name', goalName)
        .select()
        .single()

      if (error) throw error
      
      // Update local state
      setGoals(prev => prev.map(goal => goal.name === goalName ? { ...goal, ...data } : goal))
      return data
    } catch (err: any) {
      setError(err.message)
      console.error('Error updating goal:', err)
      return null
    }
  }

  return { goals, loading, error, createGoal, updateGoal }
}

// Custom hook for fetching student updates
export function useStudentUpdates(studentName?: string) {
  const [updates, setUpdates] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!studentName) return

    const fetchUpdates = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const { data, error } = await supabase
          .from('student_updates')
          .select('*')
          .eq('student', studentName)
          .order('created_at', { ascending: false })
          .limit(10)
        
        if (error) throw error
        setUpdates(data || [])
      } catch (err: any) {
        setError(err.message)
        console.error('Error fetching updates:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUpdates()
  }, [studentName])

  const createUpdate = async (updateData: {
    title: string
    content: string
    type: string
    is_public?: boolean
  }) => {
    if (!studentName) return null

    try {
      const { data, error } = await supabase
        .from('student_updates')
        .insert({
          student: studentName,
          title: updateData.title,
          content: updateData.content,
          type: updateData.type,
          date: new Date().toISOString().split('T')[0],
          is_public: updateData.is_public ?? true
        })
        .select()
        .single()

      if (error) throw error
      
      // Add to local state for immediate feedback
      setUpdates(prev => [data, ...prev])
      return data
    } catch (err: any) {
      setError(err.message)
      console.error('Error creating update:', err)
      return null
    }
  }

  const updateStudentUpdate = async (updateName: string, updateData: {
    title?: string
    content?: string
    type?: string
  }) => {
    try {
      const { data, error } = await supabase
        .from('student_updates')
        .update(updateData)
        .eq('name', updateName)
        .select()
        .single()

      if (error) throw error
      
      // Update local state
      setUpdates(prev => prev.map(update => update.name === updateName ? { ...update, ...data } : update))
      return data
    } catch (err: any) {
      setError(err.message)
      console.error('Error updating student update:', err)
      return null
    }
  }

  const deleteStudentUpdate = async (updateName: string) => {
    try {
      const { error } = await supabase
        .from('student_updates')
        .delete()
        .eq('name', updateName)

      if (error) throw error
      
      // Remove from local state
      setUpdates(prev => prev.filter(update => update.name !== updateName))
      return true
    } catch (err: any) {
      setError(err.message)
      console.error('Error deleting update:', err)
      return false
    }
  }

  return { updates, loading, error, createUpdate, updateStudentUpdate, deleteStudentUpdate }
}

// Custom hook for fetching points transactions
export function usePointsTransactions(studentName?: string, limit = 10) {
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!studentName) return

    const fetchTransactions = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const { data, error } = await supabase
          .from('points_transactions')
          .select('*')
          .eq('student', studentName)
          .order('date', { ascending: false })
          .limit(limit)
        
        if (error) throw error
        setTransactions(data || [])
      } catch (err: any) {
        setError(err.message)
        console.error('Error fetching transactions:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [studentName, limit])

  return { transactions, loading, error }
}

// Custom hook for fetching donor data (for sponsorship info)
export function useDonorData(donorIdentifier?: string) {
  const [donor, setDonor] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!donorIdentifier) return

    const fetchDonor = async () => {
      setLoading(true)
      setError(null)
      
      try {
        let query = supabase
          .from('donors')
          .select('*')
        
        if (donorIdentifier.includes('@')) {
          query = query.eq('email', donorIdentifier)
        } else {
          query = query.eq('name', donorIdentifier)
        }
        
        const { data, error } = await query.maybeSingle()
        
        if (error) throw error
        setDonor(data)
      } catch (err: any) {
        setError(err.message)
        console.error('Error fetching donor:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDonor()
  }, [donorIdentifier])

  return { donor, loading, error }
}

// Custom hook for fetching sponsorship data
export function useSponsorship(studentName?: string) {
  const [sponsorship, setSponsorship] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!studentName) return

    const fetchSponsorship = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const { data, error } = await supabase
          .from('sponsorships')
          .select(`
            *,
            donor:donors(*)
          `)
          .eq('student', studentName)
          .eq('status', 'active')
          .maybeSingle()
        
        if (error) throw error
        setSponsorship(data)
      } catch (err: any) {
        setError(err.message)
        console.error('Error fetching sponsorship:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSponsorship()
  }, [studentName])

  return { sponsorship, loading, error }
}

// Custom hook for fetching notifications
export function useNotifications(recipientType?: string, recipient?: string) {
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!recipientType || !recipient) return

    const fetchNotifications = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('recipient_type', recipientType)
          .eq('recipient', recipient)
          .order('created_date', { ascending: false })
          .limit(20)
        
        if (error) throw error
        
        const notifs = data || []
        setNotifications(notifs)
        setUnreadCount(notifs.filter(n => n.status === 'unread').length)
      } catch (err: any) {
        setError(err.message)
        console.error('Error fetching notifications:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [recipientType, recipient])

  const markAsRead = async (notificationName: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ 
          status: 'read',
          read_date: new Date().toISOString()
        })
        .eq('name', notificationName)

      if (error) throw error

      // Update local state
      setNotifications(prev => 
        prev.map(n => 
          n.name === notificationName 
            ? { ...n, status: 'read', read_date: new Date().toISOString() }
            : n
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (err: any) {
      console.error('Error marking notification as read:', err)
    }
  }

  return { notifications, loading, error, unreadCount, markAsRead }
}

// Custom hook for sponsorship management
export function useSponsorshipManagement() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const assignStudentToDonor = async (studentName: string, donorName: string, monthlyAmount: number = 50, monthlyPoints: number = 50000) => {
    setLoading(true)
    setError(null)
    
    try {
      // Check if student already has an active sponsorship
      const { data: existingSponsorships, error: checkError } = await supabase
        .from('sponsorships')
        .select('name, status')
        .eq('student', studentName)
        .eq('status', 'active')

      if (checkError) throw checkError

      if (existingSponsorships && existingSponsorships.length > 0) {
        throw new Error(`Student already has an active sponsorship (${existingSponsorships[0].name})`)
      }

      // Create new sponsorship with auto-generated name
      const sponsorshipName = `SP-${Date.now()}`
      const { data, error } = await supabase
        .from('sponsorships')
        .insert({
          name: sponsorshipName,
          donor: donorName,
          student: studentName,
          monthly_amount: monthlyAmount,
          monthly_points: monthlyPoints,
          status: 'active',
          start_date: new Date().toISOString().split('T')[0]
        })
        .select()
        .single()

      if (error) throw error

      // Update student status if needed
      await supabase
        .from('students')
        .update({ status: 'approved' })
        .eq('name', studentName)

      return data
    } catch (err: any) {
      setError(err.message)
      console.error('Error assigning student to donor:', err)
      return null
    } finally {
      setLoading(false)
    }
  }

  const removeSponsorshipAssignment = async (sponsorshipName: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const { error } = await supabase
        .from('sponsorships')
        .update({ 
          status: 'ended',
          end_date: new Date().toISOString().split('T')[0]
        })
        .eq('name', sponsorshipName)

      if (error) throw error

      return true
    } catch (err: any) {
      setError(err.message)
      console.error('Error removing sponsorship:', err)
      return false
    } finally {
      setLoading(false)
    }
  }

  const assignAvailableStudentToDonor = async (donorName: string) => {
    setLoading(true)
    setError(null)
    
    try {
      // First, get all active sponsorship student names
      const { data: activeSponsorships, error: sponsorshipError } = await supabase
        .from('sponsorships')
        .select('student')
        .eq('status', 'active')

      if (sponsorshipError) throw sponsorshipError

      const sponsoredStudentNames = (activeSponsorships || []).map(s => s.student).filter(Boolean)

      // Find approved students who are NOT in the sponsored list
      let query = supabase
        .from('students')
        .select('*')
        .eq('status', 'approved')

      if (sponsoredStudentNames.length > 0) {
        query = query.not('name', 'in', `(${sponsoredStudentNames.map(name => `'${name}'`).join(',')})`)
      }

      const { data: availableStudents, error: studentError } = await query.limit(1)

      if (studentError) throw studentError

      if (!availableStudents || availableStudents.length === 0) {
        throw new Error('No students available for sponsorship at this time')
      }

      const student = availableStudents[0]
      return await assignStudentToDonor(student.name, donorName)
    } catch (err: any) {
      setError(err.message)
      console.error('Error assigning available student to donor:', err)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { 
    assignStudentToDonor, 
    removeSponsorshipAssignment, 
    assignAvailableStudentToDonor, 
    loading, 
    error 
  }
}

// Hook for fetching all sponsorships for admin management
export function useAllSponsorships() {
  const [sponsorships, setSponsorships] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSponsorships = async () => {
    if (typeof window === 'undefined') return
    
    setLoading(true)
    setError(null)
    
    try {
      // First get sponsorships
      const { data: sponsorshipsData, error: sponsorshipsError } = await supabase
        .from('sponsorships')
        .select('*')
        .order('start_date', { ascending: false })

      if (sponsorshipsError) {
        console.error('Sponsorships query error:', sponsorshipsError)
        throw sponsorshipsError
      }

      console.log('Fetched sponsorships:', sponsorshipsData)

      // Then fetch related donor and student data
      const enrichedSponsorships = await Promise.all((sponsorshipsData || []).map(async (sponsorship) => {
        const [donorResult, studentResult] = await Promise.all([
          supabase.from('donors').select('*').eq('name', sponsorship.donor).maybeSingle(),
          supabase.from('students').select('*').eq('name', sponsorship.student).maybeSingle()
        ])

        return {
          ...sponsorship,
          donor: donorResult.data,
          student: studentResult.data
        }
      }))

      setSponsorships(enrichedSponsorships)
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching sponsorships:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSponsorships()
  }, [])

  return { sponsorships, loading, error, refetch: fetchSponsorships }
}

// Hook for fetching students and donors for assignment
export function useStudentsAndDonors() {
  const [students, setStudents] = useState<any[]>([])
  const [donors, setDonors] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (typeof window === 'undefined') return
      
      setLoading(true)
      setError(null)
      
      try {
        // Fetch students
        const { data: studentsData, error: studentsError } = await supabase
          .from('students')
          .select('*')
          .eq('status', 'approved')
          .order('join_date', { ascending: false })

        if (studentsError) throw studentsError

        // Fetch donors
        const { data: donorsData, error: donorsError } = await supabase
          .from('donors')
          .select('*')
          .eq('status', 'active')
          .order('join_date', { ascending: false })

        if (donorsError) throw donorsError

        setStudents(studentsData || [])
        setDonors(donorsData || [])
      } catch (err: any) {
        setError(err.message)
        console.error('Error fetching students and donors:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { students, donors, loading, error }
}

// Hook for profile management
export function useProfileManagement(studentName?: string) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateProfile = async (profileData: {
    first_name?: string
    last_name?: string
    phone?: string
    address?: string
    bio?: string
    education_level?: string
    school?: string
    course?: string
    year_of_study?: number
    goals?: string
  }) => {
    if (!studentName) return null

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('students')
        .update(profileData)
        .eq('name', studentName)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (err: any) {
      setError(err.message)
      console.error('Error updating profile:', err)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { updateProfile, loading, error }
}

// Hook for spending/purchase system
export function useSpendingSystem(studentName?: string) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const spendPoints = async (amount: number, description: string, category = 'purchase') => {
    if (!studentName) return null

    setLoading(true)
    setError(null)

    try {
      // Create a spending transaction
      const { data, error } = await supabase
        .from('points_transactions')
        .insert({
          student: studentName,
          amount: -Math.abs(amount), // Negative for spending
          type: 'spent',
          description,
          category,
          date: new Date().toISOString().split('T')[0],
          balance: 0 // This should be calculated by a trigger
        })
        .select()
        .single()

      if (error) throw error

      // Update student's available points
      const { error: updateError } = await supabase
        .from('students')
        .update({
          available_points: 'available_points - ' + Math.abs(amount)
        })
        .eq('name', studentName)

      if (updateError) throw updateError

      return data
    } catch (err: any) {
      setError(err.message)
      console.error('Error spending points:', err)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { spendPoints, loading, error }
}

// Hook for catalog and shopping cart management
export function useCatalog() {
  const [items, setItems] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCatalogData = async () => {
      if (typeof window === 'undefined') return
      
      setLoading(true)
      setError(null)

      try {
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('product_categories')
          .select('*')
          .eq('is_active', true)
          .order('category_name')

        if (categoriesError) throw categoriesError

        // Fetch catalog items
        const { data: itemsData, error: itemsError } = await supabase
          .from('catalog_items')
          .select('*')
          .eq('is_active', true)
          .order('item_name')

        if (itemsError) throw itemsError

        setCategories(categoriesData || [])
        setItems(itemsData || [])
      } catch (err: any) {
        setError(err.message)
        console.error('Error fetching catalog data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCatalogData()
  }, [])

  return { items, categories, loading, error }
}

// Hook for shopping cart management
export function useShoppingCart(studentName?: string) {
  const [cartItems, setCartItems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCart = async () => {
    if (!studentName || typeof window === 'undefined') return

    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('shopping_cart')
        .select(`
          *,
          catalog_item:catalog_items(*)
        `)
        .eq('student', studentName)
        .order('created_date', { ascending: false })

      if (error) throw error
      setCartItems(data || [])
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching cart:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [studentName])

  const addToCart = async (catalogItemName: string, quantity: number = 1) => {
    if (!studentName) return null

    setLoading(true)
    setError(null)

    try {
      // Get item details
      const { data: itemData, error: itemError } = await supabase
        .from('catalog_items')
        .select('*')
        .eq('name', catalogItemName)
        .single()

      if (itemError) throw itemError

      // Check if item already in cart
      const { data: existingItem } = await supabase
        .from('shopping_cart')
        .select('*')
        .eq('student', studentName)
        .eq('catalog_item', catalogItemName)
        .maybeSingle()

      if (existingItem) {
        // Update quantity
        const newQuantity = existingItem.quantity + quantity
        const { data, error } = await supabase
          .from('shopping_cart')
          .update({
            quantity: newQuantity,
            total_points: itemData.point_price * newQuantity,
            last_updated: new Date().toISOString()
          })
          .eq('name', existingItem.name)
          .select()
          .single()

        if (error) throw error
      } else {
        // Add new item
        const cartItemName = `CART-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        const { data, error } = await supabase
          .from('shopping_cart')
          .insert({
            name: cartItemName,
            student: studentName,
            catalog_item: catalogItemName,
            quantity,
            unit_points: itemData.point_price,
            total_points: itemData.point_price * quantity
          })
          .select()
          .single()

        if (error) throw error
      }

      fetchCart() // Refresh cart
      return true
    } catch (err: any) {
      setError(err.message)
      console.error('Error adding to cart:', err)
      return false
    } finally {
      setLoading(false)
    }
  }

  const updateCartItem = async (cartItemName: string, quantity: number) => {
    if (!studentName || quantity < 1) return false

    try {
      const { data: cartItem } = await supabase
        .from('shopping_cart')
        .select('unit_points')
        .eq('name', cartItemName)
        .single()

      if (!cartItem) return false

      const { error } = await supabase
        .from('shopping_cart')
        .update({
          quantity,
          total_points: cartItem.unit_points * quantity,
          last_updated: new Date().toISOString()
        })
        .eq('name', cartItemName)

      if (error) throw error

      fetchCart() // Refresh cart
      return true
    } catch (err: any) {
      setError(err.message)
      console.error('Error updating cart item:', err)
      return false
    }
  }

  const removeFromCart = async (cartItemName: string) => {
    try {
      const { error } = await supabase
        .from('shopping_cart')
        .delete()
        .eq('name', cartItemName)

      if (error) throw error

      fetchCart() // Refresh cart
      return true
    } catch (err: any) {
      setError(err.message)
      console.error('Error removing from cart:', err)
      return false
    }
  }

  const clearCart = async () => {
    if (!studentName) return false

    try {
      const { error } = await supabase
        .from('shopping_cart')
        .delete()
        .eq('student', studentName)

      if (error) throw error

      setCartItems([])
      return true
    } catch (err: any) {
      setError(err.message)
      console.error('Error clearing cart:', err)
      return false
    }
  }

  const checkout = async () => {
    if (!studentName || cartItems.length === 0) return false

    setLoading(true)
    setError(null)

    try {
      const totalPoints = cartItems.reduce((sum, item) => sum + item.total_points, 0)

      // Create transaction for the purchase
      const transactionName = `TRANS-PURCHASE-${Date.now()}`
      const { error: transactionError } = await supabase
        .from('points_transactions')
        .insert({
          name: transactionName,
          student: studentName,
          amount: -totalPoints,
          type: 'spent',
          description: `Purchase of ${cartItems.length} items from catalog`,
          category: 'purchase',
          date: new Date().toISOString().split('T')[0],
          balance: 0 // Will be calculated by trigger
        })

      if (transactionError) throw transactionError

      // Update student's available points
      const { error: updateError } = await supabase
        .rpc('update_student_points', { 
          student_name: studentName, 
          points_to_subtract: totalPoints 
        })

      if (updateError) {
        // Fallback to direct update
        const { error: directUpdateError } = await supabase
          .from('students')
          .update({
            available_points: 'available_points - ' + totalPoints
          })
          .eq('name', studentName)

        if (directUpdateError) throw directUpdateError
      }

      // Clear the cart
      await clearCart()

      return true
    } catch (err: any) {
      setError(err.message)
      console.error('Error during checkout:', err)
      return false
    } finally {
      setLoading(false)
    }
  }

  const getTotalPoints = () => {
    return cartItems.reduce((sum, item) => sum + item.total_points, 0)
  }

  const getTotalItems = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0)
  }

  return {
    cartItems,
    loading,
    error,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    checkout,
    getTotalPoints,
    getTotalItems,
    refetch: fetchCart
  }
}

// ========================================
// ADMIN DASHBOARD HOOKS
// ========================================

// Hook for platform analytics and statistics
export function usePlatformStats() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      if (typeof window === 'undefined') return
      
      setLoading(true)
      setError(null)

      try {
        // Get latest platform stats
        const { data: platformStats, error: statsError } = await supabase
          .from('platform_stats')
          .select('*')
          .order('date', { ascending: false })
          .limit(1)
          .maybeSingle()

        if (statsError) throw statsError

        // Get counts directly from tables for real-time data
        const [studentsResult, donorsResult, sponsorshipsResult, paymentsResult] = await Promise.all([
          supabase.from('students').select('status', { count: 'exact' }),
          supabase.from('donors').select('status', { count: 'exact' }),
          supabase.from('sponsorships').select('status', { count: 'exact' }),
          supabase.from('payments').select('amount', { count: 'exact' })
        ])

        const totalStudents = studentsResult.count || 0
        const totalDonors = donorsResult.count || 0
        const totalSponsorships = sponsorshipsResult.count || 0
        const totalPayments = paymentsResult.count || 0

        // Calculate additional metrics
        const { data: pendingStudents } = await supabase
          .from('students')
          .select('name', { count: 'exact' })
          .eq('status', 'pending')

        const { data: activeSponsorships } = await supabase
          .from('sponsorships')
          .select('name', { count: 'exact' })
          .eq('status', 'active')

        const { data: totalRevenue } = await supabase
          .from('payments')
          .select('amount')
          .eq('status', 'completed')

        const revenue = totalRevenue?.reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0) || 0

        setStats({
          ...platformStats,
          totalStudents,
          totalDonors,
          totalSponsorships,
          totalPayments,
          pendingStudents: pendingStudents?.length || 0,
          activeSponsorships: activeSponsorships?.length || 0,
          totalRevenue: revenue
        })
      } catch (err: any) {
        setError(err.message)
        console.error('Error fetching platform stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, loading, error }
}

// Hook for catalog management (admin)
export function useCatalogManagement() {
  const [items, setItems] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCatalogData = async () => {
    if (typeof window === 'undefined') return
    
    setLoading(true)
    setError(null)

    try {
      // Fetch catalog items with vendor info
      const { data: itemsData, error: itemsError } = await supabase
        .from('view_vendor_catalog_full')
        .select('*')
        .order('item_name')

      if (itemsError) throw itemsError

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('product_categories')
        .select('*')
        .order('category_name')

      if (categoriesError) throw categoriesError

      setItems(itemsData || [])
      setCategories(categoriesData || [])
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching catalog data:', err)
    } finally {
      setLoading(false)
    }
  }

  const addCatalogItem = async (itemData: any) => {
    try {
      const newItem = {
        name: `ITEM-${Date.now()}`,
        item_name: itemData.itemName,
        description: itemData.description,
        category: itemData.category,
        vendor: itemData.vendor,
        point_price: itemData.pointPrice,
        approximate_value_lkr: itemData.approximateValue,
        is_active: true,
        stock_quantity: itemData.stockQuantity || 0,
        max_quantity_per_month: itemData.maxQuantityPerMonth || null,
        item_code: itemData.itemCode || null
      }

      const { error } = await supabase
        .from('catalog_items')
        .insert(newItem)

      if (error) throw error
      
      fetchCatalogData() // Refresh data
      return true
    } catch (err: any) {
      setError(err.message)
      console.error('Error adding catalog item:', err)
      return false
    }
  }

  const updateCatalogItem = async (itemId: string, itemData: any) => {
    try {
      const { error } = await supabase
        .from('catalog_items')
        .update({
          item_name: itemData.itemName,
          description: itemData.description,
          category: itemData.category,
          vendor: itemData.vendor,
          point_price: itemData.pointPrice,
          approximate_value_lkr: itemData.approximateValue,
          is_active: itemData.isActive,
          stock_quantity: itemData.stockQuantity,
          max_quantity_per_month: itemData.maxQuantityPerMonth,
          item_code: itemData.itemCode
        })
        .eq('name', itemId)

      if (error) throw error
      
      fetchCatalogData() // Refresh data
      return true
    } catch (err: any) {
      setError(err.message)
      console.error('Error updating catalog item:', err)
      return false
    }
  }

  const deleteCatalogItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('catalog_items')
        .update({ is_active: false })
        .eq('name', itemId)

      if (error) throw error
      
      fetchCatalogData() // Refresh data
      return true
    } catch (err: any) {
      setError(err.message)
      console.error('Error deleting catalog item:', err)
      return false
    }
  }

  const addCategory = async (categoryData: any) => {
    try {
      const newCategory = {
        name: `PCAT-${Date.now()}`,
        category_name: categoryData.categoryName,
        description: categoryData.description,
        is_active: true,
        parent_category: categoryData.parentCategory || null
      }

      const { error } = await supabase
        .from('product_categories')
        .insert(newCategory)

      if (error) throw error
      
      fetchCatalogData() // Refresh data
      return true
    } catch (err: any) {
      setError(err.message)
      console.error('Error adding category:', err)
      return false
    }
  }

  useEffect(() => {
    fetchCatalogData()
  }, [])

  return { items, categories, loading, error, addCatalogItem, updateCatalogItem, deleteCatalogItem, addCategory, refetch: fetchCatalogData }
}

// Hook for vendor management (admin)
export function useVendorManagement() {
  const [vendors, setVendors] = useState<any[]>([])
  const [vendorCategories, setVendorCategories] = useState<any[]>([])
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchVendorData = async () => {
    if (typeof window === 'undefined') return
    
    setLoading(true)
    setError(null)

    try {
      // Fetch vendors
      const { data: vendorsData, error: vendorsError } = await supabase
        .from('vendors')
        .select('*')
        .order('vendor_name')

      if (vendorsError) throw vendorsError

      // Fetch vendor categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('vendor_categories')
        .select('*')
        .order('category_name')

      if (categoriesError) throw categoriesError

      // Fetch vendor applications
      const { data: applicationsData, error: applicationsError } = await supabase
        .from('vendor_applications')
        .select('*')
        .order('application_date', { ascending: false })

      if (applicationsError) throw applicationsError

      setVendors(vendorsData || [])
      setVendorCategories(categoriesData || [])
      setApplications(applicationsData || [])
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching vendor data:', err)
    } finally {
      setLoading(false)
    }
  }

  const addVendor = async (vendorData: any) => {
    try {
      const newVendor = {
        name: `VENDOR-${Date.now()}`,
        vendor_name: vendorData.vendorName,
        vendor_category: vendorData.category,
        contact_person: vendorData.contactPerson,
        email: vendorData.email,
        phone: vendorData.phone,
        address: vendorData.address,
        website: vendorData.website,
        business_registration: vendorData.businessRegistration,
        tax_id: vendorData.taxId,
        business_type: vendorData.businessType,
        employee_count: vendorData.employeeCount,
        established_year: vendorData.establishedYear,
        description: vendorData.description,
        status: 'active',
        verification_status: 'pending'
      }

      const { error } = await supabase
        .from('vendors')
        .insert(newVendor)

      if (error) throw error
      
      fetchVendorData() // Refresh data
      return true
    } catch (err: any) {
      setError(err.message)
      console.error('Error adding vendor:', err)
      return false
    }
  }

  const updateVendorStatus = async (vendorId: string, status: string, verificationStatus?: string) => {
    try {
      const update: any = { status }
      if (verificationStatus) update.verification_status = verificationStatus

      const { error } = await supabase
        .from('vendors')
        .update(update)
        .eq('name', vendorId)

      if (error) throw error
      
      fetchVendorData() // Refresh data
      return true
    } catch (err: any) {
      setError(err.message)
      console.error('Error updating vendor status:', err)
      return false
    }
  }

  const approveApplication = async (applicationId: string) => {
    try {
      // Get application data
      const { data: application, error: appError } = await supabase
        .from('vendor_applications')
        .select('*')
        .eq('name', applicationId)
        .single()

      if (appError) throw appError

      // Create vendor from application
      const newVendor = {
        name: `VENDOR-${Date.now()}`,
        vendor_name: application.business_name,
        vendor_category: application.business_category,
        contact_person: application.contact_person,
        email: application.email,
        phone: application.phone,
        address: application.address,
        website: application.website,
        business_registration: application.business_registration,
        tax_id: application.tax_id,
        business_type: application.business_type,
        employee_count: application.employee_count,
        established_year: application.established_year,
        description: application.description,
        status: 'active',
        verification_status: 'verified'
      }

      const { error: vendorError } = await supabase
        .from('vendors')
        .insert(newVendor)

      if (vendorError) throw vendorError

      // Update application status
      const { error: updateError } = await supabase
        .from('vendor_applications')
        .update({ 
          status: 'approved',
          review_date: new Date().toISOString().split('T')[0]
        })
        .eq('name', applicationId)

      if (updateError) throw updateError
      
      fetchVendorData() // Refresh data
      return true
    } catch (err: any) {
      setError(err.message)
      console.error('Error approving application:', err)
      return false
    }
  }

  const rejectApplication = async (applicationId: string, reason: string) => {
    try {
      const { error } = await supabase
        .from('vendor_applications')
        .update({ 
          status: 'rejected',
          rejection_reason: reason,
          review_date: new Date().toISOString().split('T')[0]
        })
        .eq('name', applicationId)

      if (error) throw error
      
      fetchVendorData() // Refresh data
      return true
    } catch (err: any) {
      setError(err.message)
      console.error('Error rejecting application:', err)
      return false
    }
  }

  useEffect(() => {
    fetchVendorData()
  }, [])

  return { 
    vendors, 
    vendorCategories, 
    applications, 
    loading, 
    error, 
    addVendor, 
    updateVendorStatus, 
    approveApplication, 
    rejectApplication, 
    refetch: fetchVendorData 
  }
}

// Hook for manual payment management (admin)
export function useManualPayments() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addPayment = async (paymentData: any) => {
    setLoading(true)
    setError(null)

    console.log('useManualPayments - addPayment called with:', paymentData)

    try {
      const newPayment = {
        name: `PAY-${Date.now()}`,
        donor: paymentData.donor,
        student: paymentData.student,
        sponsorship: paymentData.sponsorship,
        amount: paymentData.amount,
        payment_method: paymentData.paymentMethod,
        status: paymentData.status || 'completed',
        date: paymentData.processedDate || new Date().toISOString().split('T')[0],
        processed_date: new Date().toISOString(),
        payment_type: paymentData.paymentType || 'manual',
        notes: paymentData.notes || '',
        reference_number: paymentData.referenceNumber || null,
        points: Math.round(paymentData.amount * 1000) // Convert dollars to points (1 dollar = 1000 points)
      }

      console.log('Creating payment with data:', newPayment)

      const { data, error } = await supabase
        .from('payments')
        .insert(newPayment)
        .select()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
      
      console.log('Payment created successfully:', data)
      return true
    } catch (err: any) {
      console.error('Error adding payment:', err)
      setError(err.message)
      return false
    } finally {
      setLoading(false)
    }
  }

  const updatePayment = async (paymentId: string, paymentData: any) => {
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('payments')
        .update({
          amount: paymentData.amount,
          payment_method: paymentData.paymentMethod,
          status: paymentData.status,
          processed_date: paymentData.processedDate,
          notes: paymentData.notes,
          reference_number: paymentData.referenceNumber
        })
        .eq('name', paymentId)

      if (error) throw error
      
      return true
    } catch (err: any) {
      setError(err.message)
      console.error('Error updating payment:', err)
      return false
    } finally {
      setLoading(false)
    }
  }

  return { addPayment, updatePayment, loading, error }
}

// Hook for purchase orders management (admin)  
export function usePurchaseOrdersManagement() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = async () => {
    if (typeof window === 'undefined') return
    
    setLoading(true)
    setError(null)

    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('view_purchase_orders_full')
        .select('*')
        .order('request_date', { ascending: false })

      if (ordersError) throw ordersError

      // Fetch order items for each order
      const ordersWithItems = await Promise.all(
        (ordersData || []).map(async (order) => {
          const { data: items, error: itemsError } = await supabase
            .from('view_purchase_order_items_expanded')
            .select('*')
            .eq('order_id', order.order_id)

          if (itemsError) {
            console.error('Error fetching order items:', itemsError)
            return { ...order, items: [] }
          }

          return { ...order, items: items || [] }
        })
      )

      setOrders(ordersWithItems)
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching orders:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, status: string, notes?: string) => {
    try {
      const update: any = { status }
      
      if (status === 'approved') {
        update.approved_date = new Date().toISOString().split('T')[0]
      } else if (status === 'fulfilled') {
        update.fulfilled_date = new Date().toISOString().split('T')[0]
      } else if (status === 'rejected' && notes) {
        update.rejection_reason = notes
      }
      
      if (notes) update.notes = notes

      const { error } = await supabase
        .from('purchase_orders')
        .update(update)
        .eq('name', orderId)

      if (error) throw error
      
      fetchOrders() // Refresh data
      return true
    } catch (err: any) {
      setError(err.message)
      console.error('Error updating order status:', err)
      return false
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  return { orders, loading, error, updateOrderStatus, refetch: fetchOrders }
}

// Hook for user management (admin)
export function useUserManagement() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = async () => {
    if (typeof window === 'undefined') return
    
    setLoading(true)
    setError(null)

    try {
      // Get all students
      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('*')
        .order('join_date', { ascending: false })

      if (studentsError) throw studentsError

      // Get all donors
      const { data: donors, error: donorsError } = await supabase
        .from('donors')
        .select('*')
        .order('join_date', { ascending: false })

      if (donorsError) throw donorsError

      // Combine and format
      const allUsers = [
        ...(students || []).map(s => ({ ...s, userType: 'student' })),
        ...(donors || []).map(d => ({ ...d, userType: 'donor' }))
      ]

      setUsers(allUsers)
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching users:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const updateUserStatus = async (userId: string, userType: 'student' | 'donor', newStatus: string) => {
    try {
      const tableName = userType === 'student' ? 'students' : 'donors'
      const { error } = await supabase
        .from(tableName)
        .update({ status: newStatus })
        .eq('name', userId)

      if (error) throw error
      
      fetchUsers() // Refresh data
      return true
    } catch (err: any) {
      setError(err.message)
      console.error('Error updating user status:', err)
      return false
    }
  }

  return { users, loading, error, updateUserStatus, refetch: fetchUsers }
}

// Hook for payments management (admin)
export function usePaymentsManagement() {
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPayments = async () => {
    if (typeof window === 'undefined') return
    
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          donor:donors(name, first_name, last_name, email, phone),
          student:students(name, first_name, last_name, email, phone),
          sponsorship:sponsorships(name, monthly_amount, status)
        `)
        .order('processed_date', { ascending: false, nullsFirst: false })
        .order('date', { ascending: false })
        .limit(100)

      if (error) throw error
      console.log('Fetched payments:', data)
      setPayments(data || [])
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching payments:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [])

  const updatePaymentStatus = async (paymentId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('payments')
        .update({ status: newStatus })
        .eq('name', paymentId)

      if (error) throw error
      
      fetchPayments() // Refresh data
      return true
    } catch (err: any) {
      setError(err.message)
      console.error('Error updating payment status:', err)
      return false
    }
  }

  return { payments, loading, error, updatePaymentStatus, refetch: fetchPayments }
}

// Hook for audit logs (admin)
export function useAuditLogs() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchLogs = async () => {
    if (typeof window === 'undefined') return
    
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100)

      if (error) throw error
      setLogs(data || [])
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching audit logs:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  return { logs, loading, error, refetch: fetchLogs }
}

// ========================================
// DONOR DASHBOARD HOOKS
// ========================================

// Enhanced donor data hook
export function useEnhancedDonorData(donorIdentifier?: string) {
  const [donor, setDonor] = useState<any>(null)
  const [sponsorships, setSponsorships] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDonorData = async () => {
    if (!donorIdentifier || typeof window === 'undefined') return
    
    setLoading(true)
    setError(null)

    try {
      // Get donor details
      let donorQuery = supabase.from('donors').select('*')
      
      if (donorIdentifier.includes('@')) {
        donorQuery = donorQuery.eq('email', donorIdentifier)
      } else {
        donorQuery = donorQuery.eq('name', donorIdentifier)
      }
      
      const { data: donorData, error: donorError } = await donorQuery.maybeSingle()
      if (donorError) throw donorError
      
      if (!donorData) {
        setError('Donor not found')
        return
      }

      setDonor(donorData)

      // Get sponsorships
      const { data: sponsorshipsData, error: sponsorshipsError } = await supabase
        .from('sponsorships')
        .select(`
          *,
          student:students(*)
        `)
        .eq('donor', donorData.name)
        .order('start_date', { ascending: false })

      if (sponsorshipsError) throw sponsorshipsError
      setSponsorships(sponsorshipsData || [])

      // Get payments
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select(`
          *,
          student:students(*),
          sponsorship:sponsorships(*)
        `)
        .eq('donor', donorData.name)
        .order('processed_date', { ascending: false })

      if (paymentsError) throw paymentsError
      setPayments(paymentsData || [])

    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching enhanced donor data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDonorData()
  }, [donorIdentifier])

  const updateDonorProfile = async (profileData: any) => {
    if (!donor?.name) return false

    try {
      const { error } = await supabase
        .from('donors')
        .update(profileData)
        .eq('name', donor.name)

      if (error) throw error
      
      fetchDonorData() // Refresh data
      return true
    } catch (err: any) {
      setError(err.message)
      console.error('Error updating donor profile:', err)
      return false
    }
  }

  return { 
    donor, 
    sponsorships, 
    payments, 
    loading, 
    error, 
    updateDonorProfile,
    refetch: fetchDonorData 
  }
}

// Hook for donor communication
export function useDonorCommunication(donorName?: string) {
  const [communications, setCommunications] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCommunications = async () => {
    if (!donorName || typeof window === 'undefined') return
    
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('communication_logs')
        .select(`
          *,
          student:students(*)
        `)
        .eq('donor', donorName)
        .order('timestamp', { ascending: false })

      if (error) throw error
      setCommunications(data || [])
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching communications:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCommunications()
  }, [donorName])

  const sendMessage = async (studentName: string, message: string, type: string = 'message') => {
    if (!donorName) return false

    try {
      const { error } = await supabase
        .from('communication_logs')
        .insert({
          donor: donorName,
          student: studentName,
          message,
          type,
          timestamp: new Date().toISOString()
        })

      if (error) throw error
      
      fetchCommunications() // Refresh data
      return true
    } catch (err: any) {
      setError(err.message)
      console.error('Error sending message:', err)
      return false
    }
  }

  return { communications, loading, error, sendMessage, refetch: fetchCommunications }
}
