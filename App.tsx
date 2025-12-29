
import React, { useState, useEffect } from 'react';
import { ChevronRight, ArrowRight, Instagram, CheckCircle2, Star, ShieldCheck, MapPin, MessageCircle, X } from 'lucide-react';
import { EXPERT_DATA, IMAGES, QUIZ_QUESTIONS } from './constants';

// --- Types ---
type AppState = 'CHOICE' | 'QUIZ' | 'RESULT' | 'LANDING';

// --- Components ---

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
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={onClose}>
      <button className="absolute top-6 right-6 text-white" onClick={onClose}>
        <X size={32} />
      </button>
      <img src={image} className="max-w-full max-h-full rounded-lg shadow-2xl" alt="Resultado ampliado" />
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
      `Olá Dra. Giulia! Acabei de fazer o quiz no seu site e meu perfil deu COMPATÍVEL!\n\nMinhas respostas:\n${QUIZ_QUESTIONS.map((q, i) => `${i + 1}. ${q.question} -> *${answers[i]}*`).join('\n')}\n\nGostaria de agendar minha avaliação gratuita!`
    );
    return `${EXPERT_DATA.whatsapp}&text=${message}`;
  };

  // --- Views ---

  const InitialChoice = () => (
    <div className="fixed inset-0 z-[100] bg-pink-lilac flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full glass-card p-10 rounded-3xl shadow-2xl border border-white/50">
        <div className="mb-8 flex justify-center">
          <div className="w-32 h-32 rounded-full border-4 border-white shadow-2xl overflow-hidden ring-4 ring-pink-100/50 animate-float">
            <img src={IMAGES.quizBg} className="w-full h-full object-cover" alt="Dra. Giulia Bouças" />
          </div>
        </div>
        
        <h2 className="serif text-4xl mb-6 text-fuchsia-900 leading-tight">Seja bem-vinda ao universo de <br/><span className="font-bold">Dra. Giulia Bouças</span></h2>
        <p className="mb-10 text-gray-700 leading-relaxed text-lg">Para uma experiência personalizada e exclusiva, como você deseja prosseguir?</p>
        <div className="flex flex-col gap-4">
          <Button onClick={() => setState('QUIZ')} variant="primary" className="py-6">
            INICIAR AVALIAÇÃO EXCLUSIVA <ArrowRight size={20} />
          </Button>
          <Button onClick={() => setState('LANDING')} variant="outline" className="py-6 border-pink-300 text-pink-700">
            IR DIRETO PARA O SITE
          </Button>
        </div>
      </div>
    </div>
  );

  const QuizView = () => {
    const progress = ((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100;
    return (
      <div className="fixed inset-0 z-[110] bg-pink-lilac overflow-y-auto">
        {/* Foto da Dra no topo do Quiz sem obstrução no rosto */}
        <div className="relative h-[35vh] lg:h-[45vh] w-full">
           <img src={IMAGES.quizBg} className="w-full h-full object-cover object-top" alt="Dra Giulia" />
           <div className="absolute inset-0 bg-gradient-to-t from-pink-lilac via-transparent"></div>
        </div>

        <div className="max-w-md w-full mx-auto px-6 -mt-16 relative z-10 pb-20">
          <div className="mb-6 text-center">
            <span className="serif text-xl text-fuchsia-950 font-bold uppercase tracking-widest bg-white/80 backdrop-blur px-4 py-1 rounded-full shadow-sm">Dra. Giulia Bouças</span>
          </div>
          
          <div className="w-full bg-white/50 h-1.5 rounded-full mb-8 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-pink-500 to-fuchsia-600 h-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 glass-card p-8 rounded-[32px] shadow-2xl">
            <h2 className="serif text-2xl text-fuchsia-950 mb-8 text-center leading-tight font-bold">
              {QUIZ_QUESTIONS[currentQuestion].question}
            </h2>
            <div className="flex flex-col gap-3">
              {QUIZ_QUESTIONS[currentQuestion].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  className="w-full p-5 text-left rounded-2xl bg-white/90 border border-pink-50 shadow-sm hover:border-fuchsia-500 hover:bg-white transition-all duration-300 text-gray-800 font-medium text-lg flex justify-between items-center group"
                >
                  <span className="flex-1">{option}</span>
                  <ChevronRight size={20} className="text-pink-300 group-hover:text-fuchsia-500 transform group-hover:translate-x-1 transition-transform shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-8 text-center">
             <button 
                onClick={() => setState('LANDING')} 
                className="text-fuchsia-900 font-bold underline opacity-60 text-sm"
              >
                Pular avaliação e ir para o site
             </button>
          </div>
        </div>
      </div>
    );
  };

  const ResultView = () => (
    <div className="fixed inset-0 z-[120] bg-white overflow-y-auto">
      <div className="h-full flex flex-col">
        <div className="relative h-[45vh] overflow-hidden">
          <img src={IMAGES.hero} className="w-full h-full object-cover object-top" alt="Dra. Giulia" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent"></div>
          <div className="absolute top-6 left-0 right-0 text-center px-4">
             <span className="bg-green-500 text-white px-6 py-2 rounded-full font-bold text-sm shadow-xl flex items-center justify-center gap-2 w-fit mx-auto animate-pulse">
                <CheckCircle2 size={16} /> PERFIL COMPATÍVEL
             </span>
          </div>
        </div>
        
        <div className="flex-1 bg-white px-8 -mt-12 relative rounded-t-[40px] pt-12 pb-10 shadow-2xl">
          <h2 className="serif text-4xl text-fuchsia-950 font-bold mb-4 text-center leading-tight">
            Você é a Paciente Ideal.
          </h2>
          <p className="text-gray-700 text-center text-lg leading-relaxed mb-8">
            Com base nas suas respostas, o Método da <span className="font-bold text-fuchsia-700">Dra. Giulia Bouças</span> consegue entregar exatamente a <span className="italic">naturalidade e segurança</span> que você procura.
          </p>
          
          <div className="space-y-4">
            <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer">
              <Button className="w-full bg-green-500 hover:bg-green-600 border-none animate-float shadow-green-200">
                <MessageCircle size={24} /> ENVIAR MINHA AVALIAÇÃO AGORA
              </Button>
            </a>
            <a href={getWhatsAppLink(true)} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="w-full border-gray-200 text-gray-500">
                CHAMAR NO WHATSAPP SEM COMPROMISSO
              </Button>
            </a>
            <button 
              onClick={() => setState('LANDING')}
              className="w-full text-center py-4 text-pink-500 font-semibold"
            >
              CONTINUAR NAVEGANDO NO SITE
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const LandingPageView = () => (
    <div className="bg-white min-h-screen">
      {/* 1. HERO SECTION - REDESENHADA PARA NÃO COBRIR O ROSTO */}
      <section className="relative min-h-screen flex flex-col bg-pink-lilac overflow-hidden">
        {/* Bloco da Imagem - Destaque Total no Topo no Mobile */}
        <div className="w-full h-[65vh] lg:h-screen lg:absolute lg:right-0 lg:w-1/2 overflow-hidden order-1 lg:order-2">
          <img 
            src={IMAGES.hero} 
            className="w-full h-full object-cover object-top scale-105" 
            alt="Dra. Giulia Bouças" 
          />
          {/* Degradê sutil para fundir com o fundo inferior no mobile */}
          <div className="absolute inset-0 bg-gradient-to-t from-pink-lilac via-transparent lg:bg-gradient-to-r lg:from-pink-lilac"></div>
        </div>
        
        {/* Bloco do Conteúdo - Fundo Limpo e Texto Elegante */}
        <div className="w-full lg:w-1/2 px-8 py-12 lg:py-0 lg:px-24 flex flex-col justify-center items-start z-10 order-2 lg:order-1 flex-1">
          <div className="max-w-lg">
            <span className="text-fuchsia-600 font-bold tracking-widest uppercase mb-4 block animate-in fade-in slide-in-from-left duration-700">Especialista em Naturalidade</span>
            <h1 className="serif text-5xl lg:text-7xl text-fuchsia-950 mb-8 leading-[1.1] animate-in fade-in slide-in-from-left duration-1000">
              Eu sou a Giulia Bouças e vou te devolver a <span className="italic font-light">confiança</span> que você merece.
            </h1>
            <p className="text-xl text-gray-700 mb-12 leading-relaxed opacity-90 animate-in fade-in slide-in-from-left duration-1000 delay-200">
              Especialista em Harmonização Facial focada em resultados sutis, elegantes e extremamente seguros.
            </p>
            <div className="space-y-6 w-full animate-in fade-in slide-in-from-bottom duration-1000 delay-500">
              <a href={getWhatsAppLink(true)} target="_blank" rel="noopener noreferrer" className="block w-full sm:w-auto">
                <Button variant="primary" animate className="w-full sm:w-80">
                  AGENDAR CONSULTA GRATUITA
                </Button>
              </a>
              <div className="flex items-center gap-2 text-fuchsia-400 font-medium">
                <span className="w-8 h-[1px] bg-fuchsia-200"></span>
                <p className="text-sm">✨ Sem compromisso e totalmente personalizada.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. QUEM SOU EU */}
      <section className="py-24 px-8 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="relative group">
            <div className="absolute inset-0 bg-pink-200 rounded-3xl rotate-3 group-hover:rotate-6 transition-transform"></div>
            <img src={IMAGES.authority1} className="relative z-10 w-full max-w-sm rounded-3xl shadow-2xl grayscale hover:grayscale-0 transition-all duration-700" alt="Dra Giulia" />
          </div>
          <div className="flex-1">
            <h2 className="serif text-4xl lg:text-5xl text-fuchsia-950 mb-8 leading-tight">
              Uma abordagem humana para a sua beleza única.
            </h2>
            <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
              <p>
                Minha missão não é mudar quem você é, mas sim realçar a melhor versão que já existe aí dentro. Com técnica apurada e um olhar sensível, eu busco a harmonia que respeita sua identidade.
              </p>
              <ul className="space-y-4">
                {[
                  "Atendimento 100% focado na sua queixa",
                  "Produtos de altíssima qualidade mundial",
                  "Avaliação técnica, honesta e sem exageros",
                  "Acompanhamento próximo em cada etapa"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="text-fuchsia-500 mt-1 shrink-0" size={20} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. RESULTADOS REAIS */}
      <section className="py-24 px-8 bg-pink-50/50">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="serif text-4xl lg:text-5xl text-fuchsia-950 mb-4">Transformações que inspiram.</h2>
          <p className="text-gray-600 text-lg">Resultados reais focados em naturalidade.</p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
          {IMAGES.galleryResults.map((img, idx) => (
            <div 
              key={idx} 
              className="aspect-square overflow-hidden rounded-2xl shadow-sm cursor-pointer hover:scale-105 transition-transform duration-500"
              onClick={() => setSelectedImage(img)}
            >
              <img src={img} className="w-full h-full object-cover" alt={`Resultado ${idx}`} />
            </div>
          ))}
        </div>
        <p className="text-center mt-12 text-sm text-gray-400 italic">
          Nota: Resultados podem variar de pessoa para pessoa. Fotos autorizadas.
        </p>
      </section>

      {/* 4. POR QUE CONFIAR */}
      <section className="py-24 px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <ShieldCheck className="text-fuchsia-500" size={32} />, title: "Segurança Total", desc: "Protocolos rigorosos e uso das melhores tecnologias do mercado." },
              { icon: <Star className="text-fuchsia-500" size={32} />, title: "Naturalidade", desc: "O segredo de um bom procedimento é que ninguém saiba que você fez." },
              { icon: <MessageCircle className="text-fuchsia-500" size={32} />, title: "Avaliação Honesta", desc: "Eu só indico o que realmente trará benefícios para o seu caso." },
              { icon: <MapPin className="text-fuchsia-500" size={32} />, title: "Localização Premium", desc: "No coração do Tatuapé, com todo conforto e exclusividade." },
              { icon: <CheckCircle2 className="text-fuchsia-500" size={32} />, title: "CROSP Ativo", desc: "Profissional devidamente habilitada e em constante atualização." },
              { icon: <ShieldCheck className="text-fuchsia-500" size={32} />, title: "Resultados Duradouros", desc: "Planejamento focado na longevidade e saúde da sua pele." },
            ].map((card, i) => (
              <div key={i} className="p-8 rounded-3xl bg-pink-50 border border-pink-100 hover:shadow-lg transition-all duration-300">
                <div className="mb-6">{card.icon}</div>
                <h3 className="serif text-2xl text-fuchsia-950 mb-3">{card.title}</h3>
                <p className="text-gray-600 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CTA INTERMEDIARIO */}
      <section className="py-20 px-8 bg-gradient-to-r from-fuchsia-900 to-pink-900 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="serif text-4xl lg:text-5xl mb-6 leading-tight">Chega de ter medo de não se reconhecer.</h2>
          <p className="text-xl text-pink-100 mb-10 opacity-80">Você merece se sentir linda todos os dias.</p>
          <a href={getWhatsAppLink(true)} target="_blank" rel="noopener noreferrer">
            <Button variant="secondary" className="mx-auto px-12 py-6 text-xl">
              CONVERSAR COM A DRA. GIULIA <MessageCircle size={24} />
            </Button>
          </a>
        </div>
      </section>

      {/* 6. COMO FUNCIONA */}
      <section className="py-24 px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="serif text-4xl text-center text-fuchsia-950 mb-16">Sua jornada de transformação</h2>
          <div className="space-y-12">
            {[
              { step: "01", title: "Primeiro Contato", desc: "Você entra em contato via WhatsApp e nossa equipe te atende de forma personalizada." },
              { step: "02", title: "Avaliação Gratuita", desc: "Realizamos uma consulta para entender seus desejos e analisar as necessidades do seu rosto." },
              { step: "03", title: "Planejamento Único", desc: "Criamos o método ideal para você, focando em naturalidade e nos resultados que você busca." },
            ].map((item, i) => (
              <div key={i} className="flex gap-8 items-start">
                <span className="serif text-6xl text-pink-200 font-bold leading-none">{item.step}</span>
                <div>
                  <h3 className="serif text-2xl text-fuchsia-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. MAIS PROVAS - ESTILO BASTIDORES */}
      <section className="py-24 px-8 bg-pink-lilac">
        <div className="max-w-6xl mx-auto">
           <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {IMAGES.galleryLifestyle.map((img, i) => (
                <div key={i} className="rounded-2xl overflow-hidden shadow-xl aspect-[3/4] group">
                  <img src={img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Bastidores" />
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* 8. CTA FINAL */}
      <section className="py-32 px-8 bg-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="serif text-5xl lg:text-6xl text-fuchsia-950 mb-8 leading-tight">
            Pronta para elevar sua autoestima?
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Clique no botão abaixo e garanta sua <span className="font-bold text-fuchsia-700">Primeira Consulta Gratuita</span> agora mesmo.
          </p>
          <a href={getWhatsAppLink(true)} target="_blank" rel="noopener noreferrer">
            <Button variant="primary" animate className="mx-auto scale-110">
              QUERO MINHA CONSULTA GRATUITA <ArrowRight size={24} />
            </Button>
          </a>
        </div>
      </section>

      {/* 9. RODAPÉ */}
      <footer className="py-16 px-8 border-t border-pink-100 text-center bg-pink-50/30">
        <div className="max-w-xl mx-auto space-y-8">
          <div className="signature text-5xl text-fuchsia-700">{EXPERT_DATA.name}</div>
          <div className="space-y-2">
            <p className="font-bold text-gray-800">{EXPERT_DATA.profession}</p>
            <p className="text-gray-500">{EXPERT_DATA.location}</p>
          </div>
          <div className="flex justify-center gap-6">
            <a href={EXPERT_DATA.instagram} target="_blank" rel="noopener noreferrer" className="text-fuchsia-400 hover:text-fuchsia-600 transition-colors">
              <Instagram size={28} />
            </a>
            <a href={EXPERT_DATA.whatsapp} target="_blank" rel="noopener noreferrer" className="text-fuchsia-400 hover:text-fuchsia-600 transition-colors">
              <MessageCircle size={28} />
            </a>
          </div>
          <p className="text-xs text-gray-400 pt-8 uppercase tracking-widest">
            © 2024 Giulia Bouças. Todos os direitos reservados.
          </p>
        </div>
      </footer>
      
      {/* Lightbox for Gallery */}
      <Lightbox image={selectedImage} onClose={() => setSelectedImage(null)} />
    </div>
  );

  return (
    <div className="font-sans antialiased text-gray-900 overflow-x-hidden selection:bg-pink-200">
      {state === 'CHOICE' && <InitialChoice />}
      {state === 'QUIZ' && <QuizView />}
      {state === 'RESULT' && <ResultView />}
      {state === 'LANDING' && <LandingPageView />}
    </div>
  );
};

export default App;
