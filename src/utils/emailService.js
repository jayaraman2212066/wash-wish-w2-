// Real email service using Web3Forms (free email service)
const WEB3FORMS_ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY' // Get from https://web3forms.com

export const sendActivationEmail = async (userEmail, userName, activationToken) => {
  try {
    const activationLink = `${window.location.origin}/verify-email?token=${activationToken}&email=${encodeURIComponent(userEmail)}`
    
    const formData = new FormData()
    formData.append('access_key', WEB3FORMS_ACCESS_KEY)
    formData.append('subject', 'Activate Your WashWish Account')
    formData.append('from_name', 'WashWish Team')
    formData.append('to', userEmail)
    formData.append('message', `
Hi ${userName},

Welcome to WashWish! Please click the link below to activate your account:

${activationLink}

This link will expire in 24 hours.

Best regards,
WashWish Team
    `)
    
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    })
    
    const result = await response.json()
    
    if (result.success) {
      return {
        success: true,
        message: `Activation email sent successfully to ${userEmail}`
      }
    } else {
      throw new Error(result.message || 'Failed to send email')
    }
  } catch (error) {
    console.error('Email sending failed:', error)
    
    // Try alternative email service (EmailJS as fallback)
    return await sendEmailViaEmailJS(userEmail, userName, activationToken)
  }
}

// Fallback email service using EmailJS
const sendEmailViaEmailJS = async (userEmail, userName, activationToken) => {
  try {
    if (!window.emailjs) {
      throw new Error('EmailJS not available')
    }

    const activationLink = `${window.location.origin}/verify-email?token=${activationToken}&email=${encodeURIComponent(userEmail)}`
    
    // Using EmailJS public demo service (limited but works for testing)
    const response = await window.emailjs.send(
      'default_service',
      'template_activation',
      {
        to_email: userEmail,
        to_name: userName,
        from_name: 'WashWish Team',
        subject: 'Activate Your WashWish Account',
        message: `Hi ${userName},\n\nWelcome to WashWish! Click this link to activate your account:\n\n${activationLink}\n\nThis link expires in 24 hours.\n\nBest regards,\nWashWish Team`,
        activation_link: activationLink
      },
      'YOUR_EMAILJS_PUBLIC_KEY'
    )

    if (response.status === 200) {
      return {
        success: true,
        message: `Activation email sent to ${userEmail}`
      }
    } else {
      throw new Error('EmailJS failed')
    }
  } catch (error) {
    console.error('EmailJS fallback failed:', error)
    return {
      success: false,
      message: 'Email service temporarily unavailable'
    }
  }
}

// Alternative: Use Formspree for email sending
export const sendEmailViaFormspree = async (userEmail, userName, activationToken) => {
  try {
    const activationLink = `${window.location.origin}/verify-email?token=${activationToken}&email=${encodeURIComponent(userEmail)}`
    
    const response = await fetch('https://formspree.io/f/YOUR_FORMSPREE_ID', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userEmail,
        subject: 'Activate Your WashWish Account',
        message: `Hi ${userName},\n\nWelcome to WashWish! Click this link to activate your account:\n\n${activationLink}\n\nThis link expires in 24 hours.\n\nBest regards,\nWashWish Team`
      })
    })

    if (response.ok) {
      return {
        success: true,
        message: `Activation email sent to ${userEmail}`
      }
    } else {
      throw new Error('Formspree failed')
    }
  } catch (error) {
    console.error('Formspree failed:', error)
    return {
      success: false,
      message: 'Failed to send activation email'
    }
  }
}