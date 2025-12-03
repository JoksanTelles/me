export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  const { email } = body

  // 1. Validación básica
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email inválido',
    })
  }

  try {
    // 2. Llamada a la API de Kit
    const response = await $fetch(`https://api.convertkit.com/v3/forms/${config.kitFormId}/subscribe`, {
      method: 'POST',
      body: {
        api_key: config.kitApiKey,
        email: email
      }
    })

    return { success: true, data: response }
  } catch (error: any) {
    // Manejo de errores de Kit
    throw createError({
      statusCode: 500,
      statusMessage: error.data?.message || 'Error al suscribirse',
    })
  }
})