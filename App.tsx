
import React, { useState } from 'react';
import { ChevronRight, ArrowRight, Instagram, CheckCircle2, Star, ShieldCheck, MapPin, MessageCircle, X } from 'lucide-react';
import { EXPERT_DATA, IMAGES, QUIZ_QUESTIONS } from './constants';

type AppState = 'CHOICE' | 'QUIZ' | 'RESULT' | 'LANDING';

const Button: React.FC<{
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  animate?: boolean;
}> = ({ onClick, children, variant = 'primary', className = '', animate = false }) => {
  const baseStyles = "px-8 py-5 rounded-full font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 shadow-xl w-full sm:w-auto";
  const variants = {
    primary: "bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white hover:opacity-90",
    secondary: "bg-white text-fuchsia-600 hover:bg-fuchsia-50",
    outline: "border-2 border-fuchsia-500 text-fuchsia-600 hover:bg-fuchsia-50",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className} ${animate ? 'animate-bounce' : ''}`}
    >
      {children}
    </button>
  );
};

const Lightbox: React.FC<{ image: string | null; onClose: () => void }> = ({ image, onClose }) => {
  if (!image) return null;
  return (
    <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4" onClick={onClose}>
      <button className="absolute top-6 right-6 text-white" onClick={onClose}><X size={32} /></button>
      <img src={image} className="max-w-full max-h-full rounded-lg shadow-2xl animate-in zoom-in-95 duration-300" alt="Destaque" />
    </div>
  );
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>('CHOICE');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setState('RESULT');
    }
  };

  const getWhatsAppLink = (isDirect: boolean = false) => {
    if (isDirect) return EXPERT_DATA.whatsapp;
    const message = encodeURIComponent(
      `Olá Dra. Giulia! Fiz a avaliação no seu site e meu perfil é COMPATÍVEL!\n\nMinhas respostas:\n${QUIZ_QUESTIONS.map((q, i) => `${i + 1}. ${q.question} -> *${answers[i]}*`).join('\n')}\n\nGostaria de reservar minha consulta gratuita!`
    );
    return `${EXPERT_DATA.whatsapp}&text=${message}`;
  };

  const InitialChoice = () => (
    <div className="fixed inset-0 z-[100] bg-pink-lilac flex items-center justify-center p-6 overflow-y-auto">
      <div className="max-w-md w-full glass-card p-10 rounded-[40px] shadow-2xl border border-white/60 text-center relative overflow-hidden">
        <div className="mb-8 flex justify-center">
          <div className="w-32 h-32 rounded-full border-4 border-white shadow-2xl overflow-hidden ring-8 ring-fuchsia-100/50">
            <img src={IMAGES.quizBg} className="w-full h-full object-cover" alt="Dra. Giulia" />
          </div>
        </div>
        <h2 className="serif text-4xl mb-6 text-fuchsia-950 leading-tight">Bem-vinda ao universo de <br/><span className="font-bold">Dra. Giulia Bouças</span></h2>
        <p className="mb-10 text-gray-700 text-lg">Para uma experiência exclusiva, como deseja prosseguir?</p>
        <div className="flex flex-col gap-4">
          <Button onClick={() => setState('QUIZ')} variant="primary" className="py-6">INICIAR AVALIAÇÃO EXCLUSIVA <ArrowRight size={20} /></Button>
          <Button onClick={() => setState('LANDING')} variant="outline" className="py-6">IR DIRETO PARA O SITE</Button>
        </div>
      </div>
    </div>
  );

  const QuizView = () => {
    const progress = ((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100;
    return (
      <div className="fixed inset-0 z-[110] bg-pink-lilac overflow-hidden flex flex-col">
        {/* Foto da Dra sem cortes ou sombras no rosto */}
        <div className="h-[40vh] w-full relative shrink-0">
          <img src={IMAGES.quizBg} className="w-full h-full object-cover object-top" alt="Dra Giulia" />
          <div className="absolute inset-0 bg-gradient-to-t from-pink-lilac via-transparent"></div>
        </div>
        
        <div className="flex-1 px-6 -mt-16 relative z-10 overflow-y-auto pb-12">
          <div className="max-w-md mx-auto">
            <div className="mb-6 flex flex-col items-center">
              <span className="serif text-lg text-fuchsia-900 font-bold uppercase tracking-[0.2em] bg-white/60 backdrop-blur px-6 py-2 rounded-full shadow-sm mb-6">Dra. Giulia Bouças</span>
              <div className="w-full bg-white/40 h-1.5 rounded-full overflow-hidden">
                <div className="bg-fuchsia-600 h-full transition-all duration-700" style={{ width: `${progress}%` }}></div>
              </div>
            </div>

            <div className="glass-card p-8 rounded-[35px] shadow-2xl animate-in slide-in-from-bottom-6 duration-500">
              <h2 className="serif text-3xl text-fuchsia-950 mb-8 text-center font-bold leading-tight">{QUIZ_QUESTIONS[currentQuestion].question}</h2>
              <div className="flex flex-col gap-3">
                {QUIZ_QUESTIONS[currentQuestion].options.map((option, idx) => (
                  <button key={idx} onClick={() => handleAnswer(option)} className="w-full p-5 text-left rounded-2xl bg-white/90 border border-fuchsia-50 shadow-sm hover:border-fuchsia-500 hover:bg-fuchsia-50 transition-all duration-300 text-gray-800 font-medium text-lg flex justify-between items-center group">
                    <span>{option}</span>
                    <ChevronRight size={20} className="text-fuchsia-200 group-hover:text-fuchsia-600 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => setState('LANDING')} className="w-full mt-8 text-fuchsia-800 font-bold underline opacity-60 text-sm">Pular e ver o site</button>
          </div>
        </div>
      </div>
    );
  };

  const LandingPageView = () => (
    <div className="bg-white min-h-screen">
      {/* HERO SECTION: Foco total na beleza da Dra */}
      <section className="relative min-h-screen flex flex-col lg:flex-row bg-pink-lilac">
        {/* Imagem Pura à Direita (Desktop) ou Topo (Mobile) */}
        <div className="w-full h-[55vh] lg:h-screen lg:w-1/2 lg:order-2 relative overflow-hidden">
          <img src={IMAGES.hero} className="w-full h-full object-cover object-top lg:scale-105" alt="Dra. Giulia Bouças" />
          <div className="absolute inset-0 bg-gradient-to-t from-pink-lilac via-transparent lg:hidden"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-pink-lilac via-transparent hidden lg:block"></div>
        </div>

        {/* Texto em fundo limpo para não "sujar" a imagem */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-24 py-12 lg:py-0 lg:order-1 relative z-10 flex-1">
          <div className="max-w-xl">
            <span className="text-fuchsia-600 font-bold tracking-[0.3em] uppercase mb-6 block">Especialista em Naturalidade</span>
            <h1 className="serif text-5xl lg:text-8xl text-fuchsia-950 mb-8 leading-[1.05] hero-text-shadow">
              Vou te devolver a <span className="italic font-light">confiança</span> que você merece.
            </h1>
            <p className="text-xl lg:text-2xl text-gray-700 mb-12 leading-relaxed opacity-90">
              Harmonização Facial de luxo focada em resultados sutis, elegantes e extremamente seguros no Tatuapé.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <a href={getWhatsAppLink(true)} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button variant="primary" animate className="w-full">AGENDAR CONSULTA GRATUITA</Button>
              </a>
            </div>
            <div className="mt-8 flex items-center gap-4 text-fuchsia-400">
               <div className="w-12 h-[1px] bg-fuchsia-200"></div>
               <span className="text-sm font-medium">Atendimento Premium Individualizado</span>
            </div>
          </div>
        </div>
      </section>

      {/* RESULTADOS */}
      <section className="py-24 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="serif text-5xl text-fuchsia-950 mb-4">A Arte da Sutileza</h2>
            <p className="text-gray-500 text-lg">Clique para ampliar alguns de nossos resultados reais.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {IMAGES.galleryResults.map((img, idx) => (
              <div key={idx} onClick={() => setSelectedImage(img)} className="aspect-[3/4] overflow-hidden rounded-2xl cursor-pointer hover:scale-[1.02] transition-transform duration-500 shadow-sm border border-pink-50">
                <img src={img} className="w-full h-full object-cover" alt="Resultado" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AUTORIDADE */}
      <section className="py-24 px-8 bg-pink-50/50">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-20">
          <div className="w-full lg:w-1/2 relative">
             <div className="absolute -inset-4 bg-fuchsia-100 rounded-[40px] rotate-3"></div>
             <img src={IMAGES.authority1} className="relative z-10 rounded-[35px] shadow-2xl w-full grayscale hover:grayscale-0 transition-all duration-1000" alt="Giulia" />
          </div>
          <div className="w-full lg:w-1/2">
             <h2 className="serif text-4xl lg:text-5xl text-fuchsia-950 mb-8 leading-tight">Por que escolher o Método Giulia Bouças?</h2>
             <div className="space-y-8">
                {[
                  { t: "Foco em Naturalidade", d: "Nada de rostos congelados ou transformações que apagam sua identidade." },
                  { t: "Segurança em 1º Lugar", d: "Uso exclusivo de preenchedores premium e protocolos médicos rigorosos." },
                  { t: "Olhar Artístico", d: "Cada milímetro é planejado para realçar sua estrutura óssea e beleza única." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center shrink-0"><CheckCircle2 className="text-fuchsia-500" /></div>
                    <div>
                      <h4 className="serif text-2xl text-fuchsia-900 font-bold mb-2">{item.t}</h4>
                      <p className="text-gray-600 leading-relaxed">{item.d}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-32 px-8 text-center bg-fuchsia-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <img src={IMAGES.hero} className="w-full h-full object-cover" alt="bg" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="serif text-5xl lg:text-7xl mb-8 leading-tight">Sua melhor versão está a um clique.</h2>
          <p className="text-xl lg:text-2xl text-fuchsia-200 mb-12 opacity-80">Reserve agora sua avaliação gratuita e descubra o que podemos fazer por você.</p>
          <a href={getWhatsAppLink(true)} target="_blank" rel="noopener noreferrer">
             <Button variant="secondary" animate className="mx-auto scale-110 px-12 py-6">FALAR COM A DRA. GIULIA <MessageCircle /></Button>
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 px-8 bg-white border-t border-pink-100 text-center">
        <div className="signature text-6xl text-fuchsia-800 mb-8">{EXPERT_DATA.name}</div>
        <p className="font-bold tracking-widest text-fuchsia-900 mb-2 uppercase">{EXPERT_DATA.profession}</p>
        <p className="text-gray-400 mb-10">{EXPERT_DATA.location}</p>
        <div className="flex justify-center gap-8 mb-12">
          <a href={EXPERT_DATA.instagram} className="text-fuchsia-300 hover:text-fuchsia-600 transition-colors"><Instagram size={32} /></a>
          <a href={EXPERT_DATA.whatsapp} className="text-fuchsia-300 hover:text-fuchsia-600 transition-colors"><MessageCircle size={32} /></a>
        </div>
        <p className="text-[10px] text-gray-300 uppercase tracking-widest italic">Desenvolvido para Dra. Giulia Bouças - 2024</p>
      </footer>

      <Lightbox image={selectedImage} onClose={() => setSelectedImage(null)} />
    </div>
  );

  return (
    <div className="antialiased select-none">
      {state === 'CHOICE' && <InitialChoice />}
      {state === 'QUIZ' && <QuizView />}
      {state === 'RESULT' && (
        <div className="fixed inset-0 z-[150] bg-white overflow-y-auto">
          <div className="h-[45vh] w-full relative">
            <img src={IMAGES.hero} className="w-full h-full object-cover object-top" alt="Dra" />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent"></div>
            <div className="absolute top-8 left-0 right-0 flex justify-center">
               <span className="bg-green-500 text-white px-8 py-2 rounded-full font-bold shadow-2xl animate-pulse">PERFIL COMPATÍVEL ✅</span>
            </div>
          </div>
          <div className="max-w-md mx-auto px-8 py-12 text-center -mt-16 relative z-10 bg-white rounded-t-[40px]">
             <h2 className="serif text-4xl text-fuchsia-950 font-bold mb-6">Parabéns! Você é a Paciente Ideal.</h2>
             <p className="text-gray-600 text-lg mb-10 leading-relaxed">Pelo seu perfil, o método da <span className="text-fuchsia-600 font-bold">Dra. Giulia</span> é exatamente o que você precisa para realçar sua beleza com naturalidade.</p>
             <div className="space-y-4">
                <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer">
                   <Button className="w-full bg-green-500 shadow-green-200 py-6">RESERVAR MINHA CONSULTA <MessageCircle /></Button>
                </a>
                <button onClick={() => setState('LANDING')} className="w-full text-fuchsia-800 font-bold underline">Apenas ver o site agora</button>
             </div>
          </div>
        </div>
      )}
      {state === 'LANDING' && <LandingPageView />}
    </div>
  );
};

export default App;
