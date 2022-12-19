<template>
  <div v-if="editor" class="tiptap-editor flex flex-col max-h-full relative w-full border rounded">
    <div class="tiptap-editor__bar flex p-2 space-x-1 bg-white rounded">
      <button
        v-for="button in toolbarButtons"
        :key="button.name"
        type="button"
        class="w-8 h-8 flex items-center justify-center p-1 hover:bg-gray-200 rounded"
        :class="[
          button.isDiabled?.(editor) ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
          {
            'bg-gray-200': button.isActive?.(editor),
          },
        ]"
        :disabled="button.isDiabled?.(editor)"
        @click.prevent="button.run(editor)"
      >
        <component :is="button.icon" :width="button.iconWidth" :height="button.iconHeight" :class="button?.iconClass" />
      </button>
    </div>

    <EditorContent
      ref="editorContentRef"
      :editor="editor"
      class="tiptap-editor__content flex flex-col bg-white grow-1 rounded px-4 min-h-[100px] resize-y overflow-auto pb-4"
    />

    <el-dialog
      v-model="openInsertYoutubeDialog"
      title="Add Youtube"
      width="630px"
      @close="openInsertYoutubeDialog = false"
    >
      <div class="space-y-2">
        <div class="font-semibold">Youtube Link</div>
        <el-input v-model="youtubeLink" size="large" autofocus>
          <template #prefix>
            <YoutubeIcon />
          </template>
        </el-input>
      </div>

      <div class="mt-4 flex justify-end">
        <el-button @click="openInsertYoutubeDialog = false">Cancel</el-button>
        <el-button type="primary" :disabled="youtubeLink.length === 0" @click="handleInsertYoutube(youtubeLink)">
          Confirm
        </el-button>
      </div>
    </el-dialog>

    <el-dialog v-model="openInsertImageDialog" title="Add Image" width="630px" @close="openInsertImageDialog = false">
      <div>
        <div class="space-y-2">
          <div class="font-semibold">Image Url</div>
          <el-input v-model="imageLink" size="large" placeholder="Input image link" @blur="onBlur" />
        </div>

        <div class="mt-4 flex justify-end">
          <el-button @click="openInsertImageDialog = false">Cancel</el-button>
          <el-button type="primary" :disabled="imageLink.length === 0" @click="handleInsertImage(imageLink)">
            Confirm
          </el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog v-model="openInsertLinkDialog" title="Edit link" width="630px" @close="openInsertLinkDialog = false">
      <div class="space-y-2">
        <div class="flex space-x-4">
          <div class="space-y-2 flex-1">
            <div class="font-semibold">Link to (URL)</div>
            <el-input v-model="urlLink.href" size="large" @blur="onBlur" />
          </div>

          <div class="space-y-2">
            <div class="font-semibold">Link opens in</div>
            <el-select v-model="urlLink.target" size="large">
              <el-option label="The same window" value="_self" />
              <el-option label="A new window" value="_blank" />
            </el-select>
          </div>
        </div>

        <div class="space-y-2">
          <div class="font-semibold">Link title (optional)</div>
          <el-input v-model="urlLink.title" size="large" />
          <p class="text-sm mt-1">Used for accessibility and SEO</p>
        </div>

        <div class="mt-4 flex justify-end">
          <el-button @click="openInsertLinkDialog = false">Cancel</el-button>
          <el-button type="primary" @click="handleInsertLink(urlLink)">Confirm</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, FunctionalComponent, onBeforeUnmount, ref, watch } from 'vue'
import { useEditor, EditorContent, Editor } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'

import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import Youtube from '@tiptap/extension-youtube'
import Image from '@tiptap/extension-image'

import BoldIcon from './icons/bold-icon.vue'
import ItalicIcon from './icons/italic-icon.vue'
import UnderlineIcon from './icons/underline-icon.vue'
import LinkIcon from './icons/link-icon.vue'
import ListIcon from './icons/list-icon.vue'
import YoutubeIcon from './icons/youtube-i.vue'
import ImageIcon from './icons/image-icon.vue'

const props = defineProps<{
  modelValue: string
  placeholder?: string
  error?: string
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value?: string): void
  (e: 'blur', event: FocusEvent): void
}>()

const openInsertLinkDialog = ref(false)
const openInsertYoutubeDialog = ref(false)
const openInsertImageDialog = ref(false)
const focused = ref(false)
const editorContentRef = ref()

const CustomLink = Link.extend({
  addAttributes() {
    return {
      href: {
        default: null,
      },
      target: {
        default: this.options.HTMLAttributes.target,
      },
      title: {
        default: null,
      },
      class: {
        default: this.options.HTMLAttributes.class,
      },
    }
  },
})

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Underline,
    Image.configure({
      inline: true,
      allowBase64: true,
    }),
    Placeholder.configure({
      placeholder: props.placeholder,
    }),
    CustomLink.configure({
      openOnClick: false,
      autolink: false,
      HTMLAttributes: {
        rel: null,
      },
    }),
    Youtube.configure({
      controls: false,
      nocookie: true,
      allowFullscreen: false,
      autoplay: false,
    }),
  ],
  editorProps: {
    attributes: {
      spellcheck: 'false',
    },
  },
  onUpdate: () => {
    return emit('update:modelValue', editorContent.value)
  },
  onFocus: () => {
    focused.value = true
  },
  onBlur: ({ event }) => {
    focused.value = false
    return emit('blur', event)
  },
})

const editorContent = computed(() => {
  if (!editor.value || editor.value.isEmpty) {
    return ''
  }
  return editor.value.getHTML()
})

watch(
  () => props.modelValue,
  () => {
    if (props.modelValue !== editorContent.value) {
      editor.value?.commands.setContent(props.modelValue)
    }
  },
  { deep: true, immediate: true }
)

interface ToolbarButton {
  name: string
  icon: FunctionalComponent
  iconWidth?: string | number
  iconHeight?: string | number
  iconClass?: string
  isActive?: (editor?: Editor) => boolean
  isDiabled?: (editor?: Editor) => boolean
  run: (editor?: Editor) => void
}

const toolbarButtons = computed(() => {
  const butons: ToolbarButton[] = [
    {
      name: 'bold',
      icon: BoldIcon,
      isActive: editor => !!editor?.isActive('bold'),
      run: editor => editor?.chain().focus().toggleBold().run(),
    },
    {
      name: 'italic',
      icon: ItalicIcon,
      isActive: editor => !!editor?.isActive('italic'),
      run: editor => editor?.chain().focus().toggleItalic().run(),
    },
    {
      name: 'underline',
      icon: UnderlineIcon,
      isActive: editor => !!editor?.isActive('underline'),
      run: editor => editor?.chain().focus().toggleUnderline().run(),
    },
    {
      name: 'bulletList',
      icon: ListIcon,
      iconWidth: 16,
      iconHeight: 16,
      isActive: editor => !!editor?.isActive('bulletList'),
      run: editor => editor?.chain().focus().toggleBulletList().run(),
    },
    {
      name: 'link',
      icon: LinkIcon,
      isActive: editor => !!editor?.isActive('link'),
      isDiabled: editor => !!editor?.state.selection.empty && !editor.isActive('link'),
      run: () => handleOpenInsertLinkDialog(),
    },
    {
      name: 'image',
      icon: ImageIcon,
      isActive: editor => !!editor?.isActive('image'),
      run: () => handleOpenInsertImageDialog(),
    },
    {
      name: 'youtube',
      icon: YoutubeIcon,
      isActive: editor => !!editor?.isActive('youtube'),
      run: () => handleOpenInsertYoutubeDialog(),
    },
  ]
  return butons.map(button => {
    return {
      ...button,
      iconWidth: button?.iconWidth ?? 20,
      iconHeight: button?.iconHeight ?? 20,
    }
  })
})

onBeforeUnmount(() => {
  editor.value?.destroy()
})

interface InsertLinkFormValues {
  href: string
  target: string
  title?: string
}

const urlLink = ref<InsertLinkFormValues>({
  href: 'https://',
  target: '_self',
  title: undefined,
})

const handleOpenInsertLinkDialog = () => {
  const link = editor.value?.getAttributes('link')
  if (link?.href) {
    urlLink.value = {
      href: link.href,
      target: link?.target,
      title: link?.title,
    }
  } else {
    urlLink.value = {
      href: 'https://',
      target: '_self',
      title: undefined,
    }
  }

  openInsertLinkDialog.value = true
}

const handleInsertLink = (values: any) => {
  editor.value?.commands.toggleLink({
    href: values.href,
    target: values.target,
    //@ts-ignore:next-line
    title: values.title,
  })
  openInsertLinkDialog.value = false
}

const imageLink = ref<string>('')

const handleOpenInsertImageDialog = () => {
  openInsertImageDialog.value = true
}

const handleInsertImage = (value: string) => {
  editor.value?.commands.setImage({ src: value })
  editor.value?.chain().focus()
  openInsertImageDialog.value = false
}

const youtubeLink = ref<string>('')

const handleOpenInsertYoutubeDialog = () => {
  openInsertYoutubeDialog.value = true
}

const handleInsertYoutube = (value: string) => {
  editor.value?.commands.setYoutubeVideo({
    src: value,
    width: 640,
    height: 480,
  })
  openInsertYoutubeDialog.value = false
}
</script>

<style lang="scss">
.tiptap-editor__content {
  .ProseMirror {
    outline: 0;
    position: relative;
    font-size: 1rem;
    flex: 1 1 auto;
    p.is-editor-empty:first-child::before {
      content: attr(data-placeholder);
      float: left;
      color: #aaa;
      pointer-events: none;
      height: 0;
      font-size: 1rem;
    }
    ul {
      padding-left: 40px;
      list-style: outside;
    }
  }
  a {
    text-decoration: underline;
    color: var(--el-color-primary);
  }
  img {
    max-width: 100%;
    height: auto;

    &.ProseMirror-selectednode {
      outline: 3px solid #68cef8;
    }
  }
}
</style>
