const fs = require('fs')

const vegaContent = fs.readFileSync(require.resolve('vega/build/vega.js'), 'utf8')
const vegaLiteContent = fs.readFileSync(require.resolve('vega-lite/build/vega-lite.js'), 'utf8')
const vegaEmbedContent = fs.readFileSync(require.resolve('vega-embed/build/vega-embed.js'), 'utf8')

const vegaBlockMacro = function () {
  const self = this

  self.named('vega')

  self.process(function (parent, target, attrs) {
    //const filePath = parent.normalizeAssetPath(target, 'target')
    const html = `<script>asciidoctorVega.render('${target}')</script>`
    return self.createBlock(parent, 'pass', html, attrs, {})
  })
}

const vegaBlock = function () {
  const self = this

  self.named('vega')
  self.$content_model('raw')
  self.onContext('literal')

  self.process(function (parent, reader, attrs) {
    const lines = reader.getLines()
    if (lines && lines.length === 0) {
      return self.createBlock(parent, 'pass', '<div class="openblock">[vega spec is empty]</div>', attrs, {})
    }
    const data = lines.join('\n')
    const html = `<script>asciidoctorVega.render(${data})</script>`
    return self.createBlock(parent, 'pass', html, attrs, {})
  })
}

const vegaDocinfoProcessor = function () {
  const self = this
  self.process((doc) => {
    if (doc.getBackend() !== 'html5') {
      return ''
    }
    return `<script>${vegaContent}</script>
<script>${vegaLiteContent}</script>
<script>${vegaEmbedContent}</script>
<script>
  // global vegaEmbed
  const asciidoctorVega = (function () {
    return {
      render: function(spec) {
        vegaEmbed(document.currentScript, spec, {actions: false})
      }
    }
  }())
</script>`
  })
}

module.exports.register = function register (registry) {
  if (typeof registry.register === 'function') {
    registry.register(function () {
      this.block(vegaBlock)
      this.blockMacro(vegaBlockMacro)
      this.docinfoProcessor(vegaDocinfoProcessor)
    })
  } else if (typeof registry.block === 'function') {
    registry.block(vegaBlock)
    registry.blockMacro(vegaBlockMacro)
    registry.docinfoProcessor(vegaDocinfoProcessor)
  }
  return registry
}
