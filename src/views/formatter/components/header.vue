<template>
  <a-row class="header" type="flex" justify="space-between">
    <a-col>
      <a-space>
        <a-radio-group default-value="json5" size="small" v-model="fmtype">
          <a-radio-button value="json5"> json5 </a-radio-button>
          <a-radio-button value="json"> json </a-radio-button>
        </a-radio-group>
        <span v-if="!actived" class="file-name" @click="inputActive">{{ fileName }}{{ ext }}</span>
        <a-input size="small" v-else v-model="fileName" @blur="inputDeActive" @pressEnter="inputDeActive"></a-input>
      </a-space>
    </a-col>
    <a-col>
      <a-space>
        <a-button size="small" @click="fullScreen">全屏</a-button>
        <a-upload :file-list="fileList" :remove="handleRemove" :showUploadList="false" :before-upload="beforeUpload">
          <a-button size="small" @click="importCode">导入</a-button>
        </a-upload>
        <a-button size="small" @click="exportCode">导出</a-button>
        <a-button size="small" @click="copy">复制</a-button>
        <a-button size="small" @click="empty">清空</a-button>
      </a-space>
    </a-col>
  </a-row>
</template>
<script>
import { computed, ref, watch } from '@vue/composition-api'

export default {
  emits: ['full-screen', 'empty', 'copy', 'import-code', 'export-code'],
  setup (props, context) {
    const fmtype = ref('json5')
    const actived = ref(false)
    const fileName = ref('config')
    const fileList = ref([])

    const ext = computed(() => {
      return fmtype.value === 'json' ? '.json' : '.js'
    })

    watch(fmtype, (val, oldVal) => {
      if (val !== oldVal) {
        context.emit('update-type', val)
      }
    })

    const data = {
      ext,
      fmtype,
      actived,
      fileName,
      fileList
    }

    const fullScreen = () => {
      context.emit('full-screen')
    }

    const inputActive = () => {
      actived.value = true
    }
    const inputDeActive = () => {
      actived.value = false
    }

    const empty = () => {
      context.emit('empty')
    }
    const copy = () => {
      context.emit('copy')
    }
    const handleRemove = () => {}
    const beforeUpload = (file) => {
      fileList.value = [...fileList.value, file]
      const reader = new FileReader()
      reader.onload = (evt) => {
        const content = evt.target.result
        context.emit('import-code', content)
      }
      reader.readAsText(file)
      return false
    }
    const importCode = () => {}
    const exportCode = () => {
      context.emit('export-code')
    }

    const methods = {
      fullScreen,
      inputActive,
      inputDeActive,
      empty,
      copy,
      handleRemove,
      beforeUpload,
      importCode,
      exportCode
    }

    return {
      ...data,
      ...methods
    }
  }
}
</script>
<style lang="less" scoped>
.header {
  margin-bottom: 8px;
}
</style>
