import { useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import { ChevronLeft } from 'lucide-react'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <div className="section">
      <div className="container max-w-3xl">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm">
          <Link
            href="/"
            className="flex items-center gap-1 text-warm-500 transition-colors hover:text-primary-600"
          >
            <ChevronLeft className="h-4 w-4" />
            Home
          </Link>
          <span className="text-warm-300">/</span>
          <span className="text-warm-700">Privacy Policy</span>
        </nav>

        <h1 className="font-display text-4xl font-bold text-warm-900">Privacy Policy</h1>
        <p className="mt-4 text-warm-600">Last updated: December 2024</p>

        <div className="prose prose-warm mt-8 max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-warm-900">1. Introduction</h2>
            <p className="mt-4 text-warm-700">
              Metanoia Moment ("we," "our," or "us") is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, and safeguard your information
              when you use our platform to share and view faith testimonies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-warm-900">2. Information We Collect</h2>
            <div className="mt-4 space-y-4 text-warm-700">
              <h3 className="text-lg font-medium text-warm-800">Account Information</h3>
              <p>
                When you create an account, we collect your email address and optional display name.
                This helps us identify you and manage your testimonies.
              </p>

              <h3 className="text-lg font-medium text-warm-800">Testimony Content</h3>
              <p>
                When you record a testimony, we collect the video content, title, description,
                and any tags you choose to add. This content is stored securely and shared
                according to your preferences.
              </p>

              <h3 className="text-lg font-medium text-warm-800">Usage Information</h3>
              <p>
                We collect anonymous analytics about how you use our platform, including
                page views and video interactions. This helps us improve the experience.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-warm-900">3. How We Use Your Information</h2>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-warm-700">
              <li>To provide and maintain our service</li>
              <li>To notify you about changes to our platform</li>
              <li>To allow you to share your testimony with others</li>
              <li>To provide support and respond to inquiries</li>
              <li>To monitor usage and improve our platform</li>
              <li>To detect and prevent fraud or abuse</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-warm-900">4. Data Storage & Security</h2>
            <p className="mt-4 text-warm-700">
              Your data is stored securely using industry-standard encryption. Video testimonies
              are processed and stored on secure servers. We implement appropriate security
              measures to protect against unauthorized access, alteration, or destruction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-warm-900">5. Sharing Your Testimonies</h2>
            <p className="mt-4 text-warm-700">
              Testimonies you submit are shared publicly after moderation approval. By submitting
              a testimony, you consent to it being viewable by anyone visiting our platform.
              You may request removal of your testimony at any time by contacting us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-warm-900">6. Your Rights</h2>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-warm-700">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Withdraw consent for data processing</li>
              <li>Request a copy of your data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-warm-900">7. Cookies</h2>
            <p className="mt-4 text-warm-700">
              We use essential cookies to maintain your session and preferences. We do not use
              third-party tracking cookies or sell your data to advertisers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-warm-900">8. Children's Privacy</h2>
            <p className="mt-4 text-warm-700">
              Our platform is not intended for children under 13. We do not knowingly collect
              personal information from children. If you believe a child has provided us with
              personal data, please contact us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-warm-900">9. Changes to This Policy</h2>
            <p className="mt-4 text-warm-700">
              We may update this Privacy Policy from time to time. We will notify you of any
              significant changes by posting the new policy on this page and updating the
              "Last updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-warm-900">10. Contact Us</h2>
            <p className="mt-4 text-warm-700">
              If you have questions about this Privacy Policy or our data practices, please
              contact us at privacy@metanoiamoment.org.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
