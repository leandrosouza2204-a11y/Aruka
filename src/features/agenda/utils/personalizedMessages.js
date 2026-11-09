import { obterPrimeiroNome } from '../../../services/whatsappService.js';

function greeting(student, emoji) {
  const name = String(student?.nome || '').trim();
  return `Oii${name ? `, ${obterPrimeiroNome(name)}` : ''}! Tudo bem? ${emoji}`;
}

export function abbreviateWeekday(label) {
  return label.replace(/^(segunda|terça|quarta|quinta|sexta)-feira(?=,)/, '$1');
}

export function introductionFor(student) {
  return `${greeting(student, '😊')}

Queria te contar uma novidade!

Estou fazendo algumas mudanças na forma como organizo meus atendimentos, sempre buscando melhorar meu trabalho e oferecer um acompanhamento cada vez melhor pra você.

Uma dessas mudanças é a nossa agenda de treinos! 📅

A partir de agora, vou te enviar semanalmente os dias e horários das nossas aulas. Assim, fica mais fácil tanto pra você se organizar quanto pra mim manter tudo certinho por aqui.

Além disso, vou te mandar um arquivo chamado .ics, que você pode adicionar ao calendário do seu celular. Assim, nossos treinos ficam registrados na sua agenda e você pode receber lembretes antes das aulas, dependendo das configurações do calendário.

É mais uma forma de deixar nosso acompanhamento organizado e facilitar nossa rotina! 💪

Qualquer dúvida, pode me chamar, tá? 👊`;
}

export function personalizedWeeklyMessage(student, eventLabels) {
  return `${greeting(student, '😊💪')}

Passando pra te enviar nossos horários de treino dessa semana! 📅

${eventLabels.map(label => `📅 ${label}`).join('\n')}

Só pra reforçar alguns combinados importantes:

📌 Se precisar cancelar ou remarcar alguma aula, me avisa com pelo menos 24 horas de antecedência, combinado? Fora desse prazo, a aula será considerada realizada, sem direito à reposição.

⏰ Sobre os atrasos, temos uma tolerância de até 15 minutos. Depois desse período, não consigo garantir a aula, pois tenho outros alunos agendados.

Vou te enviar também o arquivo do calendário pra facilitar sua organização!

Nos vemos no treino! 💪🔥`;
}
