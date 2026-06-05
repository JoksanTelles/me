import React from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { TiptapReact } from "./TiptapReact"
import katex from 'katex'
import 'katex/dist/katex.min.css'

export function QuizBuilder({ questions, onChange }: { questions: any[], onChange: (q: any[]) => void }) {
  const addQuestion = (type: string) => {
    const q = { id: Math.random().toString(36).substr(2, 9), type, prompt: '', options: [] as string[], correctAnswers: [] as string[], pairs: [{left:'', right:''}] };
    if (type === 'multiple_choice' || type === 'multiple_selection') {
      q.options = ['Opción 1', 'Opción 2'];
      q.correctAnswers = ['Opción 1'];
    }
    onChange([...(questions || []), q]);
  }

  const updateQuestion = (id: string, updates: any) => {
    onChange(questions.map(q => q.id === id ? { ...q, ...updates } : q));
  }

  const removeQuestion = (id: string) => {
    onChange(questions.filter(q => q.id !== id));
  }

  const renderKatexPreview = (text: string) => {
    if (!text || !text.includes('$$')) return null;
    try {
      const parts = text.split('$$');
      let html = '';
      for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 1) {
          html += katex.renderToString(parts[i], { throwOnError: false });
        } else {
          html += parts[i];
        }
      }
      return <div className="text-sm mt-1 p-2 bg-muted/20 rounded" dangerouslySetInnerHTML={{ __html: html }} />;
    } catch(e) { return null; }
  }

  if (!Array.isArray(questions)) questions = [];

  return (
    <div className="space-y-6">
      {questions.map((q, idx) => (
        <div key={q.id} className="p-4 border rounded-lg bg-card space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-bold text-sm">Pregunta {idx + 1} ({q.type.replace('_', ' ')})</span>
            <Button variant="ghost" size="sm" className="text-destructive" onClick={() => removeQuestion(q.id)}>X</Button>
          </div>
          
          <div className="space-y-2">
            <Label>Pregunta / Enunciado</Label>
            <TiptapReact value={q.prompt} onChange={v => updateQuestion(q.id, { prompt: v })} />
          </div>

          {(q.type === 'multiple_choice' || q.type === 'multiple_selection') && (
            <div className="space-y-2 mt-4 p-4 bg-muted/30 rounded-md">
              <Label>Opciones</Label>
              {q.options?.map((opt: string, oIdx: number) => (
                <div key={oIdx} className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Input value={opt} onChange={e => {
                      const newOpts = [...q.options];
                      newOpts[oIdx] = e.target.value;
                      updateQuestion(q.id, { options: newOpts });
                    }} />
                    <input type={q.type === 'multiple_choice' ? 'radio' : 'checkbox'} 
                      checked={q.correctAnswers?.includes(opt)}
                      onChange={(e) => {
                        if (q.type === 'multiple_choice') {
                          updateQuestion(q.id, { correctAnswers: [opt] })
                        } else {
                          const newAns = e.target.checked 
                            ? [...(q.correctAnswers||[]), opt] 
                            : (q.correctAnswers||[]).filter((a:string) => a !== opt);
                          updateQuestion(q.id, { correctAnswers: newAns });
                        }
                      }} 
                    /> Correcta
                    <Button variant="ghost" size="sm" onClick={() => {
                      const newOpts = q.options.filter((_:any, i:number) => i !== oIdx);
                      updateQuestion(q.id, { options: newOpts });
                    }}>X</Button>
                  </div>
                  {renderKatexPreview(opt)}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => updateQuestion(q.id, { options: [...(q.options||[]), `Opción ${(q.options?.length||0)+1}`] })}>+ Agregar Opción</Button>
            </div>
          )}

          {q.type === 'matching' && (
            <div className="space-y-2 mt-4 p-4 bg-muted/30 rounded-md">
              <Label>Pares (Izquierda = Derecha)</Label>
              {q.pairs?.map((pair: any, pIdx: number) => (
                <div key={pIdx} className="mb-4 border-b pb-2 last:border-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Input placeholder="Izquierda" value={pair.left} onChange={e => {
                      const newPairs = [...q.pairs];
                      newPairs[pIdx].left = e.target.value;
                      updateQuestion(q.id, { pairs: newPairs });
                    }} />
                    <span>=</span>
                    <Input placeholder="Derecha" value={pair.right} onChange={e => {
                      const newPairs = [...q.pairs];
                      newPairs[pIdx].right = e.target.value;
                      updateQuestion(q.id, { pairs: newPairs });
                    }} />
                    <Button variant="ghost" size="sm" onClick={() => {
                      updateQuestion(q.id, { pairs: q.pairs.filter((_:any, i:number) => i !== pIdx) });
                    }}>X</Button>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">{renderKatexPreview(pair.left)}</div>
                    <div className="flex-1">{renderKatexPreview(pair.right)}</div>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => updateQuestion(q.id, { pairs: [...(q.pairs||[]), {left:'', right:''}] })}>+ Agregar Par</Button>
            </div>
          )}

          {q.type === 'fill_in_blank' && (
            <div className="text-xs text-muted-foreground mt-2">
              Usa corchetes para los espacios en blanco en el enunciado. Ejemplo: "El cielo es de color [azul]".
            </div>
          )}
        </div>
      ))}

      <div className="flex gap-2 flex-wrap">
        <Button variant="outline" size="sm" onClick={() => addQuestion('multiple_choice')}>+ Multiple Choice</Button>
        <Button variant="outline" size="sm" onClick={() => addQuestion('multiple_selection')}>+ Multiple Selection</Button>
        <Button variant="outline" size="sm" onClick={() => addQuestion('matching')}>+ Join the Answer</Button>
        <Button variant="outline" size="sm" onClick={() => addQuestion('fill_in_blank')}>+ Fill in the Blank</Button>
      </div>
    </div>
  )
}
