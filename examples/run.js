const asciidoctorVega = require('../index.js')
const asciidoctor = require('@asciidoctor/core')()

const registry = asciidoctor.Extensions.create()
asciidoctorVega.register(registry)
asciidoctor.convertFile('sample.adoc', { extension_registry: registry })
