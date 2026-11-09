import { buscarUsuarioLogado } from './authSessionService';
import { supabase } from './supabase';

export async function buscarApresentacaoEnviada(alunoId) {
  const user = await buscarUsuarioLogado();
  const { data, error } = await supabase.from('agenda_apresentacoes')
    .select('aluno_id').eq('profissional_id', user.id).eq('aluno_id', alunoId).maybeSingle();
  if (error) throw error;
  return Boolean(data);
}

export async function confirmarApresentacaoEnviada(alunoId) {
  const user = await buscarUsuarioLogado();
  const { error } = await supabase.from('agenda_apresentacoes')
    .upsert({ profissional_id: user.id, aluno_id: alunoId }, { onConflict: 'profissional_id,aluno_id', ignoreDuplicates: true });
  if (error) throw error;
}
