<script>
import Footer from "./components/footer";
import Header from "./components/header";
import beautify from "js-beautify";
import json5 from "json5";
import { saveAs } from "file-saver";

// import language js
import "codemirror/mode/javascript/javascript.js";

// import theme style
import "codemirror/theme/neo.css";
import {
  computed,
  defineComponent,
  reactive,
  watch,
  ref,
} from "@vue/composition-api";

export default defineComponent({
  setup(props, context) {
    const r = context.root;
    const fullscreen = ref(false);
    const teleport = ref(true);
    const code = ref("");
    const fmtcode = ref("");
    const headerRef = ref(null);
    const cmOptions = reactive({
      tabSize: 4,
      mode: "text/javascript",
      theme: "neo",
      lineNumbers: true,
      line: true,
      viewportMargin: Infinity,
    });
    const fcmOptions = reactive({
      tabSize: 4,
      mode: "text/javascript",
      theme: "neo",
      lineNumbers: true,
      line: true,
      readOnly: true,
      viewportMargin: Infinity,
    });

    const fmttype = computed(() => {
      return headerRef.value.fmtype;
    });

    const data = {
      fullscreen,
      teleport,
      code,
      fmtcode,
      cmOptions,
      fcmOptions,
    };

    const refs = {
      headerRef,
    };

    const save = (content, name) => {
      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      saveAs(blob, name);
    };
    const exportCode = () => {
      if (fmtcode.value) {
        const { fmtype, fileName } = this.$refs.header;
        const ext = fmtype === "json" ? ".json" : ".js";
        save(this.fmtcode, fileName + ext);
      } else {
        r.$message.warning("导出文件内容不能为空!");
      }
    };
    const importCode = (codes) => {
      code.value = codes;
    };
    const copy = () => {
      if (fmtcode.value) {
        r.$copyText(fmtcode.value)
          .then((message) => {
            console.log("copy", message);
            r.$message.success("已复制到剪贴板!");
          })
          .catch((err) => {
            console.log("copy.err", err);
            r.$message.error("复制失败!");
          });
      } else {
        r.$message.warning("复制的内容不能为空!");
      }
    };
    const empty = () => {
      code.value = "";
      fmtcode.value = "";
    };
    const toggle = () => {
      r.$fullscreen.toggle(r.$el.querySelector(".fullscreen-wrapper"), {
        teleport: teleport.value,
        callback: (isFullscreen) => {
          fullscreen.value = isFullscreen;
        },
      });
    };
    const beautifyJs = (code) => {
      try {
        return beautify.js(code);
      } catch (error) {
        console.log(error);
      }
    };
    const jsonformat = (code) => {
      try {
        code = JSON.stringify(JSON.parse(code));
      } catch (error) {
        code = error.toString();
      }
      return code;
    };
    const json5format = (code) => {
      try {
        code = json5.stringify(json5.parse(code));
      } catch (error) {
        code = error.toString();
      }
      return code;
    };
    const formatCode = (code) => {
      let fmtd = "";
      if (code) {
        if (fmttype.value === "json") {
          fmtd = jsonformat(code);
        } else {
          fmtd = json5format(code);
        }
        fmtcode.value = beautifyJs(fmtd);
      } else {
        fmtcode.value = "";
      }
    };
    const update = () => {
      formatCode(code.value);
    };

    const methods = {
      exportCode,
      importCode,
      copy,
      empty,
      toggle,
      update,
    };

    watch(code, (code, oldCode) => {
      if (code !== oldCode) {
        formatCode(code);
      }
    });

    return {
      ...refs,
      ...data,
      ...methods,
    };
  },
  render() {
    const {  cmOptions, fcmOptions } = this;
    const { exportCode, importCode, copy, empty, toggle, update } = this;

    return (
      <div class="fullscreen-wrapper">
        <a-row class="container">
          <a-row>
            <Header
              ref="headerRef"
              onfull-screen={toggle}
              onempty={empty}
              oncopy={copy}
              onimport-code={importCode}
              onexport-code={exportCode}
              onupdate-type={update}
            />
          </a-row>
          <a-row class="content">
            <a-col span="12" class="left-code-frame">
              <codemirror
                class="CodeMirror"
                vModel={this.code}
                options={cmOptions}
              />
            </a-col>
            <a-col span="12">
              <codemirror vModel={this.fmtcode} options={fcmOptions} />
            </a-col>
          </a-row>
          <a-row>
            <Footer />
          </a-row>
        </a-row>
      </div>
    );
  },
});
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
