const chai = require('chai')
const expect = chai.expect
const dirtyChai = require('dirty-chai')

chai.use(dirtyChai)

const asciidoctorVega = require('../index.js')
const asciidoctor = require('@asciidoctor/core')()

describe('Vega extension', () => {
  it('should load vega inline spec', () => {
    const input = `
[vega]
....
{
  "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
  "data": {
    "values": [
      {"a": "A", "b": 28},
      {"a": "B", "b": 55},
      {"a": "C", "b": 43}
    ]
  },
  "encoding": {
    "y": {"field": "a", "type": "ordinal"},
    "x": {"field": "b", "type": "quantitative"}
  },
  "layer": [{
    "mark": "bar"
  }, {
    "mark": {
      "type": "text",
      "align": "left",
      "baseline": "middle",
      "dx": 3
    },
    "encoding": {
      "text": {"field": "b", "type": "quantitative"}
    }
  }]
}
....
`
    const registry = asciidoctor.Extensions.create()
    asciidoctorVega.register(registry)
    const html = asciidoctor.convert(input, { extension_registry: registry })
    expect(html).to.contain('"text": {"field": "b", "type": "quantitative"}')
    expect(html).to.contain('<script>asciidoctorVega.render(')
  })

  it('should load ordinal.vl spec', () => {
    const input = `
vega::test/fixtures/ordinal.vl[]
`
    const registry = asciidoctor.Extensions.create()
    asciidoctorVega.register(registry)
    const html = asciidoctor.convert(input, { extension_registry: registry })
    expect(html).to.contain(`<script>asciidoctorVega.render('test/fixtures/ordinal.vl')`)
  })

  it('should load temporal.vl spec', () => {
    const input = `
vega::test/fixtures/temporal.vl[]
`
    const registry = asciidoctor.Extensions.create()
    asciidoctorVega.register(registry)
    const html = asciidoctor.convert(input, { extension_registry: registry })
    expect(html).to.contain(`<script>asciidoctorVega.render('test/fixtures/temporal.vl')`)
  })
})
