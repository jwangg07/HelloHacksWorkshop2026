const express = require('express')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 5001

app.use(cors())
app.use(express.json())

// Template GET endpoint. Replace the response with your application data.
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend is running',
  })
})

// Return the requested Pokémon type from PokéAPI by numeric ID or name.
app.get('/api/type/:idOrName', async (req, res) => {
  const { idOrName } = req.params
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/type/${encodeURIComponent(idOrName)}/`)

    if (!response.ok) {
      return res.status(response.status).json({
        error: `PokéAPI request failed with status ${response.status}`,
      })
    }

    const data = await response.json()
    const damageRelations = data.damage_relations || {}

    return res.json({
      half_damage_to: (damageRelations.half_damage_to || []).map((type) => type.name),
      double_damage_from: (damageRelations.double_damage_from || []).map((type) => type.name),
    })
  } catch (error) {
    return res.status(502).json({
      error: 'Unable to reach PokéAPI',
    })
  }
})

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`)
})
