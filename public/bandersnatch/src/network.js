class Network {
  constructor({ host }) {
    this.host = host
  }

  parseManifestURL({ url, fileResolution, fileResolutionTag, hostTag }) {
    return url.replace(fileResolutionTag, fileResolution).replace(hostTag, this.host)
  }

  async fetchFile(url) {
    const response = await fetch(url)
    return response.arrayBuffer()
  }

  async getProperResolution(url) {
    const startMs = Date.now()
    const response = await fetch(url)
    await response.arrayBuffer()
    const endMs = Date.now()
    const durationMs = (endMs - startMs)
    console.log('durationMs', durationMs);

    // ao inves de calcular o throughput vamos calcular pelo tempo
    const resolutions = [
      // pior cenario possivel em segundos
      { start: 3000, end: 20000, resolution: 144 },
      // ate 3 segundos
      { start: 901, end: 3000, resolution: 360 },
      // menos de 1 segundo
      { start: 0, end: 900, resolution: 720 },
    ]

    const item = resolutions.find(item => {
      return item.start <= durationMs && item.end >= durationMs
    })

    const LOWEST_RESOLUTION = 144
    // se for mais de 30 s
    if (!item) return LOWEST_RESOLUTION

    return item.resolution
  }
}