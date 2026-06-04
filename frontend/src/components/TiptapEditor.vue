<template>
  <div class="border border-stone-200 rounded-xl overflow-hidden bg-white flex flex-col h-full">
    <!-- Toolbar -->
    <div v-if="editor" class="bg-stone-50 border-b border-stone-200 p-2 flex flex-wrap gap-1 items-center shrink-0">
      
      <button type="button" @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'bg-stone-200': editor.isActive('heading', { level: 1 }) }" class="p-1.5 rounded hover:bg-stone-200 text-stone-700 flex items-center justify-center" title="Título 1">
        <Icon name="format_h1" size="20" />
      </button>
      <button type="button" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'bg-stone-200': editor.isActive('heading', { level: 2 }) }" class="p-1.5 rounded hover:bg-stone-200 text-stone-700 flex items-center justify-center" title="Título 2">
        <Icon name="format_h2" size="20" />
      </button>
      <button type="button" @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'bg-stone-200': editor.isActive('heading', { level: 3 }) }" class="p-1.5 rounded hover:bg-stone-200 text-stone-700 flex items-center justify-center" title="Título 3">
        <Icon name="format_h3" size="20" />
      </button>
      <button type="button" @click="editor.chain().focus().toggleHeading({ level: 4 }).run()" :class="{ 'bg-stone-200': editor.isActive('heading', { level: 4 }) }" class="p-1.5 rounded hover:bg-stone-200 text-stone-700 flex items-center justify-center" title="Título 4">
        <Icon name="format_h4" size="20" />
      </button>
      
      <div class="w-px h-5 bg-stone-300 mx-1"></div>
      
      <button type="button" @click="editor.chain().focus().toggleBold().run()" :class="{ 'bg-stone-200': editor.isActive('bold') }" class="p-1.5 rounded hover:bg-stone-200 text-stone-700 flex items-center justify-center" title="Negrita">
        <Icon name="format_bold" size="20" />
      </button>
      <button type="button" @click="editor.chain().focus().toggleItalic().run()" :class="{ 'bg-stone-200': editor.isActive('italic') }" class="p-1.5 rounded hover:bg-stone-200 text-stone-700 flex items-center justify-center" title="Cursiva">
        <Icon name="format_italic" size="20" />
      </button>
      <button type="button" @click="editor.chain().focus().toggleUnderline().run()" :class="{ 'bg-stone-200': editor.isActive('underline') }" class="p-1.5 rounded hover:bg-stone-200 text-stone-700 flex items-center justify-center" title="Subrayado">
        <Icon name="format_underlined" size="20" />
      </button>
      <button type="button" @click="editor.chain().focus().toggleStrike().run()" :class="{ 'bg-stone-200': editor.isActive('strike') }" class="p-1.5 rounded hover:bg-stone-200 text-stone-700 flex items-center justify-center" title="Tachado">
        <Icon name="format_strikethrough" size="20" />
      </button>
      
      <div class="w-px h-5 bg-stone-300 mx-1"></div>

      <button type="button" @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'bg-stone-200': editor.isActive('bulletList') }" class="p-1.5 rounded hover:bg-stone-200 text-stone-700 flex items-center justify-center" title="Lista de viñetas">
        <Icon name="format_list_bulleted" size="20" />
      </button>
      <button type="button" @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'bg-stone-200': editor.isActive('orderedList') }" class="p-1.5 rounded hover:bg-stone-200 text-stone-700 flex items-center justify-center" title="Lista numerada">
        <Icon name="format_list_numbered" size="20" />
      </button>
      <button type="button" @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'bg-stone-200': editor.isActive('blockquote') }" class="p-1.5 rounded hover:bg-stone-200 text-stone-700 flex items-center justify-center" title="Cita">
        <Icon name="format_quote" size="20" />
      </button>
      
      <div class="w-px h-5 bg-stone-300 mx-1"></div>

      <button type="button" @click="editor.chain().focus().toggleCode().run()" :class="{ 'bg-stone-200': editor.isActive('code') }" class="p-1.5 rounded hover:bg-stone-200 text-stone-700 flex items-center justify-center" title="Código inline">
        <Icon name="code" size="20" />
      </button>
      <button type="button" @click="editor.chain().focus().toggleCodeBlock().run()" :class="{ 'bg-stone-200': editor.isActive('codeBlock') }" class="p-1.5 rounded hover:bg-stone-200 text-stone-700 flex items-center justify-center" title="Bloque de código">
        <Icon name="data_object" size="20" />
      </button>
      
      <!-- Selector de lenguaje si el codeBlock está activo -->
      <select v-if="editor.isActive('codeBlock')" 
              @change="setLanguage($event.target.value)"
              :value="editor.getAttributes('codeBlock').language || 'javascript'"
              class="ml-1 bg-white border border-stone-300 rounded px-2 py-1 text-xs outline-none focus:border-rose-400 font-sans cursor-pointer text-stone-600">
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="java">Java</option>
        <option value="html">HTML</option>
        <option value="css">CSS</option>
        <option value="bash">Bash</option>
        <option value="sql">SQL</option>
        <option value="json">JSON</option>
      </select>

      <div class="w-px h-5 bg-stone-300 mx-1"></div>

      <button type="button" @click="addLink" :class="{ 'bg-stone-200': editor.isActive('link') }" class="p-1.5 rounded hover:bg-stone-200 text-stone-700 flex items-center justify-center" title="Insertar enlace">
        <Icon name="link" size="20" />
      </button>
      
      <div class="relative">
        <button type="button" @click="$refs.fileInput.click()" class="p-1.5 rounded hover:bg-stone-200 text-stone-700 flex items-center justify-center" title="Subir imagen">
          <Icon name="image" size="20" />
        </button>
        <input type="file" ref="fileInput" @change="uploadImage" accept="image/*" class="hidden" />
      </div>

      <button type="button" @click="addYoutube" class="p-1.5 rounded hover:bg-stone-200 text-stone-700 flex items-center justify-center" title="Insertar video YouTube">
        <Icon name="smart_display" size="20" />
      </button>

      <div class="w-px h-5 bg-stone-300 mx-1"></div>
      
      <button type="button" @click="editor.chain().focus().undo().run()" :disabled="!editor.can().undo()" class="p-1.5 rounded hover:bg-stone-200 text-stone-700 flex items-center justify-center disabled:opacity-50" title="Deshacer">
        <Icon name="undo" size="20" />
      </button>
      <button type="button" @click="editor.chain().focus().redo().run()" :disabled="!editor.can().redo()" class="p-1.5 rounded hover:bg-stone-200 text-stone-700 flex items-center justify-center disabled:opacity-50" title="Rehacer">
        <Icon name="redo" size="20" />
      </button>
    </div>

    <!-- Editor content -->
    <div class="flex-1 overflow-y-auto p-6 cursor-text bg-white">
      <editor-content :editor="editor" class="tiptap-styled-content focus:outline-none min-h-[400px]" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, watch } from 'vue';
import { pb } from '../lib/pocketbase';
import Icon from './Icon.vue';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';

import { all, createLowlight } from 'lowlight';
const lowlight = createLowlight(all);

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
});
const emit = defineEmits(['update:modelValue']);

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Underline,
    Link.configure({ openOnClick: false }),
    Image,
    Youtube.configure({ inline: false }),
    CodeBlockLowlight.configure({
      lowlight,
      defaultLanguage: 'javascript'
    })
  ],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML());
  },
  editorProps: {
    attributes: {
      class: 'focus:outline-none tiptap-styled-content min-h-[400px]',
    },
  },
});

watch(() => props.modelValue, (value) => {
  if (editor.value) {
    const isSame = editor.value.getHTML() === value;
    if (isSame) return;
    editor.value.commands.setContent(value, false);
  }
});

// watch is enough, useEditor handles destroy automatically

const setLanguage = (lang) => {
  if (editor.value) {
    editor.value.chain().focus().setCodeBlock({ language: lang }).run();
  }
};

const addLink = () => {
  const previousUrl = editor.value.getAttributes('link').href;
  const url = window.prompt('URL', previousUrl);
  if (url === null) return;
  if (url === '') {
    editor.value.chain().focus().extendMarkRange('link').unsetLink().run();
    return;
  }
  editor.value.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
};

const uploadImage = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    // Upload to local Pocketbase media collection
    const record = await pb.collection('media').create(formData);
    const url = pb.files.getUrl(record, record.file);
    
    editor.value.chain().focus().setImage({ src: url }).run();
  } catch (error) {
    alert("Error al subir la imagen. Asegúrate de estar autenticado como administrador.");
    console.error(error);
  }
  event.target.value = ''; // reset file input
};

const addYoutube = () => {
  const url = window.prompt('URL de YouTube');
  if (url) {
    editor.value.commands.setYoutubeVideo({
      src: url,
      width: Math.max(320, parseInt(640, 10)) || 640,
      height: Math.max(180, parseInt(480, 10)) || 480,
    })
  }
};
</script>

