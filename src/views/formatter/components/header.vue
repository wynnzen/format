<script>
import { computed, defineComponent, ref, watch } from "@vue/composition-api";

export default defineComponent({
  emits: ["full-screen", "empty", "copy", "import-code", "export-code","update-type"],
  setup(props, context) {
    const fmtype = ref("json5");
    const actived = ref(false);
    const fileName = ref("config");
    const fileList = ref([]);

    const ext = computed(() => {
      return fmtype.value === "json" ? ".json" : ".js";
    });

    watch(fmtype, (val, oldVal) => {
      if (val !== oldVal) {
        context.emit("update-type", val);
      }
    });

    const data = {
      ext,
      fmtype,
      actived,
      fileName,
      fileList,
    };

    const fullScreen = () => {
      context.emit("full-screen");
    };

    const inputActive = () => {
      actived.value = true;
    };
    const inputDeActive = () => {
      actived.value = false;
    };

    const empty = () => {
      context.emit("empty");
    };
    const copy = () => {
      context.emit("copy");
    };
    const handleRemove = () => {};
    const beforeUpload = (file) => {
      fileList.value = [...fileList.value, file];
      const reader = new FileReader();
      reader.onload = (evt) => {
        const content = evt.target.result;
        context.emit("import-code", content);
      };
      reader.readAsText(file);
      return false;
    };
    const importCode = () => {};
    const exportCode = () => {
      context.emit("export-code");
    };

    const methods = {
      fullScreen,
      inputActive,
      inputDeActive,
      empty,
      copy,
      handleRemove,
      beforeUpload,
      importCode,
      exportCode,
    };

    return {
      ...data,
      ...methods,
    };
  },

  render() {
    const {
      fullScreen,
      inputActive,
      inputDeActive,
      empty,
      copy,
      handleRemove,
      beforeUpload,
      importCode,
      exportCode,
    } = this;

    const { ext, actived, fileList } = this;
    return (
      <a-row class="header" type="flex" justify="space-between">
        <a-col>
          <a-space>
            <a-radio-group default-value="json5" size="small" vModel={this.fmtype}>
              <a-radio-button value="json5"> json5 </a-radio-button>
              <a-radio-button value="json"> json </a-radio-button>
            </a-radio-group>
            {!actived ? (
              <span class="file-name" onClick={inputActive}>
                {this.fileName}
                {ext}
              </span>
            ) : (
              <a-input
                size="small"
                vModel={this.fileName}
                onBlur={inputDeActive}
                onPressEnter={inputDeActive}
              ></a-input>
            )}
          </a-space>
        </a-col>
        <a-col>
          <a-space>
            <a-button size="small" onClick={fullScreen}>
              全屏
            </a-button>
            <a-upload
              file-list={fileList}
              remove={handleRemove}
              showUploadList={false}
              before-upload={beforeUpload}
            >
              <a-button size="small" onClick={importCode}>
                导入
              </a-button>
            </a-upload>
            <a-button size="small" onClick={exportCode}>
              导出
            </a-button>
            <a-button size="small" onClick={copy}>
              复制
            </a-button>
            <a-button size="small" onClick={empty}>
              清空
            </a-button>
          </a-space>
        </a-col>
      </a-row>
    );
  },
});
</script>
<style lang="less" scoped>
.header {
  margin-bottom: 8px;
}
</style>