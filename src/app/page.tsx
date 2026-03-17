'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/atoms/Button'
import { ThemeSwitcher } from '@/components/atoms/ThemeSwitcher'
import { ArrowRight, Zap, CheckCircle, Users, Rocket, TrendingUp, Globe, Lightbulb, BarChart3, Shield } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center">
              <Rocket className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900 dark:text-white">Task Enrich</span>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden sm:flex items-center gap-6">
              <a href="#features" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                Pricing
              </a>
              <a href="#faq" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                FAQ
              </a>
            </nav>
            <ThemeSwitcher />
            <Button variant="primary" size="md" onClick={() => router.push('/es/auth/login')}>
              Ingresar
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-40 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-semibold">Productividad sin límites</span>
                </div>
                <h1 className="text-6xl sm:text-7xl font-bold text-slate-900 dark:text-white leading-tight">
                  Enriquece tus tareas
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-400 max-w-lg">
                  La plataforma más simple para gestionar, organizar y automatizar tus proyectos. Todo lo que necesitas en un solo lugar.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button size="lg" icon={<ArrowRight className="w-5 h-5" />} iconPosition="right" onClick={() => router.push('/es/auth/signup')}>
                  Comienza gratis
                </Button>
                <Button variant="outline" size="lg" onClick={() => router.push('/es/auth/login')}>
                  Demostración
                </Button>
              </div>

              <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  Más de <span className="font-semibold text-slate-900 dark:text-white">5,000 equipos</span> en 50 países confían en Task Enrich
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 border-2 border-white dark:border-slate-950 text-white text-xs font-bold flex items-center justify-center"
                      >
                        {i}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span key={i} className="text-amber-400">★</span>
                    ))}
                  </div>
                  <span className="text-xs text-slate-600 dark:text-slate-400">4.9 / 5</span>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/15 to-emerald-500/15 dark:from-blue-500/10 dark:to-emerald-500/5 rounded-3xl blur-3xl"></div>
              <div className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="h-3 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full w-32"></div>
                    <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full w-full"></div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full w-5/6"></div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-900 rounded-full w-4/6"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-20 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">Características principales</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Herramientas poderosas diseñadas para simplificar tu flujo de trabajo
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              { icon: Zap, title: 'Súper rápido', desc: 'Carga instantánea con rendimiento optimizado' },
              { icon: CheckCircle, title: 'Simple', desc: 'Interfaz intuitiva sin complicaciones' },
              { icon: Rocket, title: 'Potente', desc: 'Herramientas avanzadas cuando las necesites' },
              { icon: Users, title: 'Colaborativo', desc: 'Trabaja con tu equipo en tiempo real' },
              { icon: BarChart3, title: 'Analytics', desc: 'Datos y métricas para tomar decisiones' },
              { icon: Shield, title: 'Seguro', desc: 'Encriptación de grado empresarial' },
            ].map((f, i) => {
              const Icon = f.icon
              return (
                <div
                  key={i}
                  className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-600 hover:shadow-lg dark:hover:shadow-lg/20 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{f.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">{f.desc}</p>
                </div>
              )
            })}
          </div>

          {/* Feature Highlight */}
          <div className="bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-950/20 dark:to-emerald-950/20 rounded-2xl p-12 border border-blue-200 dark:border-blue-800">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Automatización inteligente</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Automatiza tareas repetitivas y ahorra horas cada semana. Define reglas simples y deja que Task Enrich haga el trabajo.
                </p>
                <ul className="space-y-3">
                  {['Flujos automatizados', 'Triggers personalizados', 'Integraciones'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                      <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-200 dark:border-slate-800">
                <div className="space-y-4">
                  <div className="h-32 bg-gradient-to-br from-blue-500/10 to-emerald-500/10 rounded-lg"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-100 dark:bg-slate-900 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">Planes simples y transparentes</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Elige el plan perfecto para tu equipo
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Starter',
                price: 'Gratis',
                features: ['Hasta 10 tareas', 'Acceso básico', 'Email support', '1 usuario']
              },
              {
                name: 'Professional',
                price: '$9',
                period: '/mes',
                features: ['Tareas ilimitadas', 'Automatización', 'Integrations', 'Hasta 5 usuarios', 'Analytics', 'Chat support'],
                highlighted: true
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                features: ['Todo en Professional', 'SLA garantizado', 'Dedicated support', 'SSO', 'Custom integrations']
              }
            ].map((plan, i) => (
              <div
                key={i}
                className={`rounded-xl border transition-all duration-300 ${
                  plan.highlighted
                    ? 'bg-gradient-to-b from-blue-50 to-blue-50/50 dark:from-blue-950/30 dark:to-blue-950/10 border-blue-500 dark:border-blue-600 shadow-lg scale-105'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="p-8">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-slate-900 dark:text-white">{plan.price}</span>
                    {plan.period && <span className="text-slate-600 dark:text-slate-400">{plan.period}</span>}
                  </div>
                  <Button
                    variant={plan.highlighted ? 'primary' : 'outline'}
                    size="md"
                    className="w-full mb-8"
                    onClick={() => router.push('/es/auth/signup')}
                  >
                    Comenzar
                  </Button>
                  <ul className="space-y-3">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">Preguntas frecuentes</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Respuestas a las preguntas más comunes
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: '¿Cuáles son las limitaciones del plan gratuito?',
                a: 'El plan gratuito incluye hasta 10 tareas, 1 usuario y acceso básico a todas las características. Es perfecto para empezar.'
              },
              {
                q: '¿Puedo cambiar de plan en cualquier momento?',
                a: 'Sí, puedes actualizar o cambiar tu plan en cualquier momento. Los cambios se aplican al próximo período de facturación.'
              },
              {
                q: '¿Ofrecen soporte?',
                a: 'Sí, todos nuestros planes incluyen soporte por email. El plan Professional incluye chat support prioritario.'
              },
              {
                q: '¿Es segura mi información?',
                a: 'Utilizamos encriptación de grado empresarial (AES-256) y cumplimos con GDPR. Tu información está 100% segura.'
              }
            ].map((item, i) => (
              <details key={i} className="group border border-slate-200 dark:border-slate-800 rounded-lg p-6 cursor-pointer hover:border-blue-500 dark:hover:border-blue-600 transition-colors">
                <summary className="flex items-center justify-between font-semibold text-slate-900 dark:text-white">
                  <span>{item.q}</span>
                  <span className="transition-transform group-open:rotate-180">▼</span>
                </summary>
                <p className="text-slate-600 dark:text-slate-400 mt-4">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-blue-700 dark:to-emerald-700 rounded-3xl p-12 sm:p-16 text-center text-white shadow-2xl">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Comienza hoy, sin tarjeta de crédito
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Prueba todas las características del plan Professional durante 14 días de forma completamente gratuita
            </p>
            <Button
              size="lg"
              variant="outline"
              icon={<ArrowRight className="w-5 h-5" />}
              iconPosition="right"
              className="bg-white hover:bg-slate-100 text-slate-900"
              onClick={() => router.push('/es/auth/signup')}
            >
              Crear cuenta gratis
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Rocket className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="font-bold text-slate-900 dark:text-white">Task Enrich</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                La plataforma más simple para gestionar tus proyectos
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Producto</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="#features" className="hover:text-slate-900 dark:hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-slate-900 dark:hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#faq" className="hover:text-slate-900 dark:hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Contacto</a></li>
                <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacidad</a></li>
                <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Términos</a></li>
                <li><a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
              <p>© 2026 Task Enrich. Todos los derechos reservados.</p>
              <div className="flex gap-6">
                <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">Twitter</a>
                <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">LinkedIn</a>
                <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors">GitHub</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
