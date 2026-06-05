import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { all, createLowlight } from 'lowlight'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { MathExtension } from '@aarkue/tiptap-math-extension'
import 'katex/dist/katex.min.css'

const lowlight = createLowlight(all)

export function TiptapReact({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Link.configure({ openOnClick: false }),
      Underline,
      Image,
      Youtube,
      CodeBlockLowlight.configure({ lowlight }),
      MathExtension.configure({ evaluation: false }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'tiptap-styled-content outline-none min-h-[300px] p-4 max-w-full prose dark:prose-invert',
      },
    },
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  if (!editor) return null

  return (
    <div className="flex flex-col w-full bg-background border rounded-md shadow-sm">
      <div className="flex flex-wrap gap-1 p-2 bg-muted/50 border-b rounded-t-md sticky top-0 z-10 backdrop-blur">
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'bg-muted' : ''}><b>B</b></Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'bg-muted' : ''}><i>I</i></Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'bg-muted' : ''}><u>U</u></Button>
        <div className="w-px h-6 bg-border mx-1 my-auto"></div>
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}>H2</Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? 'bg-muted' : ''}>H3</Button>
        <div className="w-px h-6 bg-border mx-1 my-auto"></div>
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'bg-muted' : ''}>• Lista</Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={editor.isActive('codeBlock') ? 'bg-muted' : ''}>&lt;/&gt;</Button>
        <div className="w-px h-6 bg-border mx-1 my-auto"></div>
        <Button type="button" variant="ghost" size="sm" onClick={() => {
          const url = window.prompt('URL de la imagen:')
          if (url) editor.chain().focus().setImage({ src: url }).run()
        }}>Imagen</Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => {
          editor.chain().focus().insertContent('$$  $$').run()
        }}>Fórmula</Button>
      </div>
      <EditorContent editor={editor} className="flex-1 overflow-y-auto max-h-[65vh]" />
    </div>
  )
}
