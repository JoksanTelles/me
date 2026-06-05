import React, { useState, useEffect } from 'react';
import { pb } from '../../lib/pocketbase';
import { TiptapReact } from '../admin/TiptapReact';

interface LearnViewerProps {
  course: any;
  sections: any[];
  projects: any[];
  currentItem: any;
  currentItemType: string;
  completedItemIds: string[];
  userProgress: any[];
  userTasks: any[];
  userProjects: any[];
  userId: string;
}

export function LearnViewer({ course, sections, projects, currentItem, currentItemType, completedItemIds: initialCompleted, userProgress, userTasks, userProjects, userId }: LearnViewerProps) {
  const [completedIds, setCompletedIds] = useState<string[]>(initialCompleted || []);
  const curProgress = (userProgress || []).find((p: any) => p.quiz_id === currentItem.id);
  const [taskData, setTaskData] = useState({ title: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, any>>(curProgress?.quiz_answers || {});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(curProgress?.score || 0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const existingTask = (userTasks || []).find(t => t.task_id === currentItem.id);
  const existingProject = (userProjects || []).find(p => p.project_id === currentItem.id);
  
  const existingSubmission = currentItemType === 'task' ? existingTask : currentItemType === 'project' ? existingProject : null;
  const isSubmissionPending = existingSubmission && existingSubmission.status === 'submitted';
  
  const isCompleted = completedIds.includes(currentItem.id);

  // Flatten items to find next URL
  const allItems: any[] = [];
  sections.forEach(sec => {
    sec.items.forEach((i: any) => allItems.push(i));
  });
  projects.forEach(p => allItems.push({ ...p, itemType: 'project' }));

  const currentIndex = allItems.findIndex(i => i.id === currentItem.id);
  const nextItem = currentIndex !== -1 && currentIndex + 1 < allItems.length ? allItems[currentIndex + 1] : null;

  const markCompletedAndNext = async () => {
    if (!isCompleted) {
      setSubmitting(true);
      try {
        const payload: any = { user_id: userId, isCompleted: true };
        if (currentItemType === 'lesson') payload.lesson_id = currentItem.id;
        if (currentItemType === 'task') {
          payload.task_id = currentItem.id;
          try {
            await pb.collection('task_submissions').create({
              user_id: userId,
              task_id: currentItem.id,
              title: taskData.title,
              description: taskData.description,
              status: 'submitted'
            });
          } catch(e) { console.error("Failed to save task submission", e); }
        }
        if (currentItemType === 'quiz') {
          payload.quiz_id = currentItem.id;
          payload.score = quizScore;
          payload.passed = quizScore >= 80;
          payload.quiz_answers = quizAnswers;
        }
        if (currentItemType === 'project') {
          payload.project_id = currentItem.id;
          try {
            await pb.collection('project_submissions').create({
              user_id: userId,
              project_id: currentItem.id,
              title: taskData.title,
              description: taskData.description,
              status: 'submitted'
            });
          } catch(e) { console.error("Failed to save project submission", e); }
        }

        if (currentItemType === 'lesson' || currentItemType === 'quiz') {
          await pb.collection('user_progress').create(payload);
          setCompletedIds([...completedIds, currentItem.id]);
        }
        
        if (currentItemType === 'task' || currentItemType === 'project') {
          window.location.reload(); // Reload to show "Esperando calificación"
          return;
        }
      } catch (e) {
        console.error(e);
        alert('Error al guardar el progreso');
      } finally {
        setSubmitting(false);
      }
    }

    if (nextItem) {
      window.location.href = `/learn/${course.slug}/${nextItem.id}`;
    } else {
      const allItemIds = allItems.map(i => i.id);
      const isAllCompleted = allItemIds.every(id => completedIds.includes(id) || id === currentItem.id);
      if (isAllCompleted) {
        window.location.href = `/completed?course=${course.id}`;
      } else {
        alert('Aún tienes lecciones, tareas o proyectos sin aprobar. Espera la validación de tu profesor o revisa las lecciones anteriores.');
      }
    }
  };

  const submitQuiz = () => {
    const questions = currentItem.questions || [];
    let correct = 0;
    questions.forEach((q: any) => {
      const ans = quizAnswers[q.id];
      if (!ans) return;
      if (q.type === 'multiple_choice' && ans === q.correctAnswers[0]) correct++;
      if (q.type === 'multiple_selection') {
        const isCorrect = Array.isArray(ans) && ans.length === q.correctAnswers.length && ans.every((a: string) => q.correctAnswers.includes(a));
        if (isCorrect) correct++;
      }
      if (q.type === 'fill_in_blank') {
        const match = q.prompt.match(/\[(.*?)\]/);
        const expected = match ? match[1] : '';
        if (ans.trim().toLowerCase() === expected.trim().toLowerCase()) correct++;
      }
      if (q.type === 'matching') {
        let isCorrect = true;
        (q.pairs || []).forEach((p: any) => {
          if (ans[p.left] !== p.right) isCorrect = false;
        });
        if (isCorrect) correct++;
      }
    });
    setQuizScore(Math.round((correct / questions.length) * 100) || 0);
    setQuizSubmitted(true);
  };

  return (
    <>
      <aside className="w-80 bg-white border-r border-stone-200 flex flex-col h-full shrink-0">
        <div className="p-6 border-b border-stone-100">
          <a href="/" className="text-sm font-medium text-stone-500 hover:text-rose-500 mb-2 inline-block">← Dashboard</a>
          <h2 className="font-title text-xl text-rose-950 uppercase">{course.title}</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {sections.map(section => (
            <div key={section.id}>
              <h3 className="font-bold text-stone-800 mb-3 text-sm uppercase tracking-wide">{section.title}</h3>
              <ul className="space-y-2">
                {section.items.map((item: any) => {
                  const isCur = item.id === currentItem.id;
                  const isComp = completedIds.includes(item.id);
                  let icon = '▶';
                  if (item.itemType === 'quiz') icon = '❓';
                  if (item.itemType === 'task') icon = '📝';
                  
                  return (
                    <a key={item.id} href={`/learn/${course.slug}/${item.id}`} className={`flex items-center gap-3 text-sm p-2 rounded-lg transition-colors ${isCur ? 'bg-rose-50 text-rose-600 font-bold' : 'text-stone-500 hover:bg-stone-100'}`}>
                      {isComp ? <span className="text-green-500">✓</span> : <span className={isCur ? 'text-rose-500' : 'text-stone-300'}>{icon}</span>}
                      {item.title}
                    </a>
                  )
                })}
              </ul>
            </div>
          ))}

          {projects.length > 0 && (
            <div>
              <h3 className="font-bold text-stone-800 mb-3 text-sm uppercase tracking-wide">Proyectos del Curso</h3>
              <ul className="space-y-2">
                {projects.map((project: any) => {
                  const isCur = project.id === currentItem.id;
                  const isComp = completedIds.includes(project.id);
                  return (
                    <a key={project.id} href={`/learn/${course.slug}/${project.id}`} className={`flex items-center gap-3 text-sm p-2 rounded-lg transition-colors ${isCur ? 'bg-rose-50 text-rose-600 font-bold' : 'text-stone-500 hover:bg-stone-100'}`}>
                      {isComp ? <span className="text-green-500">✓</span> : <span className={isCur ? 'text-rose-500' : 'text-stone-300'}>🚀</span>}
                      {project.title}
                    </a>
                  )
                })}
              </ul>
            </div>
          )}
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8 md:p-12 relative">
        <div className="max-w-3xl mx-auto pb-24">
          <h1 className="font-title text-4xl text-stone-900 uppercase mb-6 flex items-center gap-4">
            {currentItemType === 'quiz' && '❓ '}
            {currentItemType === 'task' && '📝 '}
            {currentItemType === 'project' && '🚀 '}
            {currentItem.title}
          </h1>

          {/* RENDERING LESSON */}
          {currentItemType === 'lesson' && (
            <div className="tiptap-styled-content bg-white p-8 rounded-2xl shadow-sm border border-stone-100" dangerouslySetInnerHTML={{ __html: currentItem.content?.html || currentItem.description || '<p class="text-stone-400 italic">No hay contenido.</p>' }}>
            </div>
          )}

          {/* RENDERING TASK OR PROJECT */}
          {(currentItemType === 'task' || currentItemType === 'project') && (
            <div className="space-y-8">
              <div className="tiptap-styled-content bg-white p-8 rounded-2xl shadow-sm border border-stone-100" dangerouslySetInnerHTML={{ __html: currentItem.description?.html || currentItem.description || '' }}></div>
              
              {!isCompleted && !isSubmissionPending ? (
                <div className="bg-stone-100 p-8 rounded-2xl border border-stone-200">
                  <h3 className="font-bold text-lg mb-4">Entrega tu {currentItemType === 'task' ? 'tarea' : 'proyecto'}</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-stone-700 mb-1">Título de tu entrega</label>
                      <input type="text" value={taskData.title} onChange={e => setTaskData({...taskData, title: e.target.value})} className="w-full border border-stone-300 rounded-lg p-2" placeholder="Mi entrega" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-stone-700 mb-1">Descripción / Enlaces</label>
                      <div className="bg-white border border-stone-300 rounded-lg overflow-hidden">
                        <TiptapReact value={taskData.description} onChange={v => setTaskData({...taskData, description: v})} />
                      </div>
                    </div>
                    <div className="pt-2">
                      <button 
                        onClick={markCompletedAndNext} 
                        disabled={submitting || !taskData.title}
                        className="bg-stone-900 hover:bg-black disabled:opacity-50 text-white font-bold py-3 px-8 rounded-xl shadow-md transition-all uppercase tracking-wide w-full"
                      >
                        {submitting ? 'Enviando...' : `Enviar ${currentItemType === 'task' ? 'Tarea' : 'Proyecto'} y Continuar`}
                      </button>
                    </div>
                  </div>
                </div>
              ) : isSubmissionPending ? (
                <div className="bg-amber-50 text-amber-700 p-6 rounded-2xl border border-amber-200 font-medium flex items-center gap-3">
                  <span className="text-2xl">⏳</span> Tu entrega está siendo evaluada por el profesor.
                </div>
              ) : (
                <div className="bg-green-50 text-green-700 p-6 rounded-2xl border border-green-200 font-medium flex items-center gap-3">
                  <span className="text-2xl">✓</span> Has completado {currentItemType === 'task' ? 'esta tarea' : 'este proyecto'}.
                </div>
              )}
            </div>
          )}

          {/* RENDERING QUIZ */}
          {currentItemType === 'quiz' && (
            <div className="space-y-8">
              {!quizSubmitted && !isCompleted ? (
                <div className="space-y-8">
                  {(() => {
                    const questions = currentItem.questions || [];
                    const q = questions[currentQuestionIndex];
                    if (!q) return null;
                    
                    let displayPrompt = q.prompt;
                    if (q.type === 'fill_in_blank') {
                      displayPrompt = displayPrompt.replace(/\[(.*?)\]/g, '_________');
                    }

                    return (
                      <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
                        <div className="flex justify-between items-center mb-4">
                          <div className="font-bold text-stone-500 text-sm uppercase">Pregunta {currentQuestionIndex + 1} de {questions.length}</div>
                        </div>
                        <div className="tiptap-styled-content mb-6" dangerouslySetInnerHTML={{ __html: displayPrompt }} />
                        
                        {q.type === 'multiple_choice' && (
                          <div className="space-y-2">
                            {q.options.map((opt: string) => (
                              <label key={opt} className={`flex items-center gap-3 p-3 border border-stone-200 rounded-lg hover:bg-stone-50 ${isCompleted ? 'opacity-70 cursor-default' : 'cursor-pointer'}`}>
                                <input type="radio" disabled={isCompleted} name={`q_${q.id}`} value={opt} checked={quizAnswers[q.id] === opt} onChange={() => setQuizAnswers({...quizAnswers, [q.id]: opt})} />
                                <span>{opt}</span>
                              </label>
                            ))}
                          </div>
                        )}

                        {q.type === 'multiple_selection' && (
                          <div className="space-y-2">
                            {q.options.map((opt: string) => {
                              const isChecked = (quizAnswers[q.id] || []).includes(opt);
                              return (
                                <label key={opt} className={`flex items-center gap-3 p-3 border border-stone-200 rounded-lg hover:bg-stone-50 ${isCompleted ? 'opacity-70 cursor-default' : 'cursor-pointer'}`}>
                                  <input type="checkbox" disabled={isCompleted} checked={isChecked} onChange={(e) => {
                                    const cur = quizAnswers[q.id] || [];
                                    setQuizAnswers({...quizAnswers, [q.id]: e.target.checked ? [...cur, opt] : cur.filter((x: string) => x !== opt)});
                                  }} />
                                  <span>{opt}</span>
                                </label>
                              )
                            })}
                          </div>
                        )}

                        {q.type === 'fill_in_blank' && (
                          <div>
                            <input type="text" disabled={isCompleted} className="w-full border border-stone-300 rounded-lg p-3 disabled:opacity-70 disabled:bg-stone-50" placeholder="Escribe tu respuesta..." value={quizAnswers[q.id] || ''} onChange={e => setQuizAnswers({...quizAnswers, [q.id]: e.target.value})} />
                          </div>
                        )}
                        
                        {q.type === 'matching' && (
                          <div className="space-y-3">
                            {(q.pairs || []).map((p: any) => (
                              <div key={p.left} className="flex gap-4 items-center">
                                <div className="flex-1 p-3 bg-stone-100 rounded-lg">{p.left}</div>
                                <select disabled={isCompleted} className="flex-1 p-3 border border-stone-300 rounded-lg disabled:opacity-70 disabled:bg-stone-50" value={(quizAnswers[q.id] || {})[p.left] || ''} onChange={e => {
                                  const cur = quizAnswers[q.id] || {};
                                  setQuizAnswers({...quizAnswers, [q.id]: { ...cur, [p.left]: e.target.value }});
                                }}>
                                  <option value="">Selecciona correspondencia...</option>
                                  {q.pairs.map((x: any) => <option key={x.right} value={x.right}>{x.right}</option>)}
                                </select>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex justify-between mt-8 pt-4 border-t border-stone-100">
                          <button 
                            onClick={() => setCurrentQuestionIndex(i => Math.max(0, i - 1))}
                            disabled={currentQuestionIndex === 0}
                            className="px-4 py-2 text-stone-500 font-medium hover:text-stone-800 disabled:opacity-30 transition-colors"
                          >
                            &larr; Anterior
                          </button>
                          
                          {currentQuestionIndex < questions.length - 1 ? (
                            <button 
                              onClick={() => setCurrentQuestionIndex(i => i + 1)}
                              className="px-6 py-2 bg-stone-100 text-stone-800 font-bold rounded-lg hover:bg-stone-200 transition-colors"
                            >
                              Siguiente &rarr;
                            </button>
                          ) : (
                            <button 
                              onClick={submitQuiz}
                              className="px-6 py-2 bg-stone-900 text-white font-bold rounded-lg hover:bg-black transition-colors"
                            >
                              Finalizar y Calificar
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })()}
                </div>
              ) : (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200 text-center">
                  <div className="text-6xl mb-4">{quizScore >= 80 || isCompleted ? '🏆' : '😅'}</div>
                  <h3 className="font-title text-2xl mb-2">{isCompleted ? 'Quiz Completado' : `Tu Puntuación: ${quizScore}%`}</h3>
                  {!isCompleted && quizScore < 80 && <p className="text-stone-500 mb-6">Necesitas repasar un poco más.</p>}
                  {!isCompleted && quizScore >= 80 && <p className="text-green-600 font-bold mb-6">¡Excelente trabajo!</p>}
                </div>
              )}
            </div>
          )}

        </div>

        <div className="fixed bottom-0 left-80 right-0 bg-white border-t border-stone-200 p-4 flex justify-between items-center z-10">
          <div className="text-stone-500 font-medium px-4">
            {isCompleted ? 'Progreso Guardado' : (currentItemType === 'quiz' && !quizSubmitted ? 'Resuelve el quiz para continuar' : 'Marca como completado para continuar')}
          </div>
          <button 
            onClick={markCompletedAndNext} 
            disabled={submitting || ((currentItemType === 'task' || currentItemType === 'project') && !taskData.title && !isCompleted) || (currentItemType === 'quiz' && !quizSubmitted && !isCompleted)}
            className="bg-rose-500 hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-xl shadow-md transition-all uppercase text-sm tracking-wide">
            {isCompleted ? (nextItem ? 'Siguiente' : 'Finalizar Curso') : 'Completar y Continuar'}
          </button>
        </div>
      </main>
    </>
  );
}
