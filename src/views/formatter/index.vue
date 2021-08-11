<template>
  <div class="fullscreen-wrapper">
    <a-row class="container">
      <a-row>
        <Header
          ref="header"
          @full-screen="toggle"
          @empty="empty"
          @copy="copy"
          @import-code="importCode"
          @export-code="exportCode"
          @update-type="update"
        />
      </a-row>
      <a-row class="content">
        <a-col :span="12" class="left-code-frame">
          <codemirror class="CodeMirror" v-model="code" :options="cmOptions" />
        </a-col>
        <a-col :span="12">
          <codemirror v-model="fmtcode" :options="fcmOptions" />
        </a-col>
      </a-row>
      <a-row>
        <Footer />
      </a-row>
    </a-row>
  </div>
</template>
<script>
import Footer from './components/footer'
import Header from './components/header'
import beautify from 'js-beautify'
import json5 from 'json5'
import { saveAs } from 'file-saver'

// import language js
import 'codemirror/mode/javascript/javascript.js'

// import theme style
import 'codemirror/theme/neo.css'
export default {
  components: {
    Footer,
    Header
  },
  computed: {
    fmtype () {
      return this.$refs.header.fmtype
    }
  },
  watch: {
    code (code, oldCode) {
      if (code !== oldCode) {
        this.formatCode(code)
      }
    }
  },
  methods: {
    save (content, name) {
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
      saveAs(blob, name)
    },
    exportCode () {
      if (this.fmtcode) {
        const { fmtype, fileName } = this.$refs.header
        const ext = fmtype === 'json' ? '.json' : '.js'
        this.save(this.fmtcode, fileName + ext)
      } else {
        this.$message.warning('导出文件内容不能为空!')
      }
    },
    importCode (code) {
      this.code = code
    },
    copy () {
      if (this.fmtcode) {
        this.$copyText(this.fmtcode)
          .then((message) => {
            console.log('copy', message)
            this.$message.success('已复制到剪贴板!')
          })
          .catch((err) => {
            console.log('copy.err', err)
            this.$message.error('复制失败!')
          })
      } else {
        this.$message.warning('复制的内容不能为空!')
      }
    },
    empty () {
      this.code = ''
      this.fmtcode = ''
    },
    toggle () {
      this.$fullscreen.toggle(this.$el.querySelector('.fullscreen-wrapper'), {
        teleport: this.teleport,
        callback: (isFullscreen) => {
          this.fullscreen = isFullscreen
        }
      })
    },
    beautifyJs (code) {
      try {
        return beautify.js(code)
      } catch (error) {
        console.log(error)
      }
    },
    jsonformat (code) {
      try {
        code = JSON.stringify(JSON.parse(code))
      } catch (error) {
        code = error.toString()
      }
      return code
    },
    json5format (code) {
      try {
        code = json5.stringify(json5.parse(code))
      } catch (error) {
        code = error.toString()
      }
      return code
    },
    formatCode (code) {
      let fmtd = ''
      if (code) {
        if (this.fmtype === 'json') {
          fmtd = this.jsonformat(code)
        } else {
          fmtd = this.json5format(code)
        }
        this.fmtcode = this.beautifyJs(fmtd)
      } else {
        this.fmtcode = ''
      }
    },
    update () {
      this.formatCode(this.code)
    }
  },
  data () {
    return {
      fullscreen: false,
      teleport: true,
      code: '',
      fmtcode: '',
      cmOptions: {
        tabSize: 4,
        mode: 'text/javascript',
        theme: 'neo',
        lineNumbers: true,
        line: true,
        viewportMargin: Infinity
      },
      fcmOptions: {
        tabSize: 4,
        mode: 'text/javascript',
        theme: 'neo',
        lineNumbers: true,
        line: true,
        readOnly: true,
        viewportMargin: Infinity
      }
    }
  }
}
</script>
<style lang="less">
.CodeMirror {
  height: 90vh;
}
</style>
<style lang="less" scoped>
.container {
  padding: 8px;
}
.content {
  border: 1px solid #ccc;
}

.left-code-frame {
  border-right: 1px solid #ccc;
}
.fullscreen-wrapper {
  background: white;
  height: 100vh;
}
</style>
