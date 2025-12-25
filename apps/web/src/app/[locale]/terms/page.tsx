import { useTranslations } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import { ChevronLeft } from 'lucide-react'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function TermsPage({ params }: Props) {
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
          <span className="text-warm-700">Terms of Service</span>
        </nav>

        <h1 className="font-display text-4xl font-bold text-warm-900">Terms of Service</h1>
        <p className="mt-4 text-warm-600">Last updated: December 2024</p>

        <div className="prose prose-warm mt-8 max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-warm-900">1. Acceptance of Terms</h2>
            <p className="mt-4 text-warm-700">
              By accessing or using Metanoia Moment ("the Platform"), you agree to be bound by
              these Terms of Service. If you do not agree to these terms, please do not use
              our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-warm-900">2. Description of Service</h2>
            <p className="mt-4 text-warm-700">
              Metanoia Moment is a platform for sharing video testimonies of faith and
              transformation through Jesus Christ. Our mission is to preserve and share
              stories of God's work in people's lives for current and future generations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-warm-900">3. User Accounts</h2>
            <div className="mt-4 space-y-4 text-warm-700">
              <p>
                To submit testimonies, you must create an account. You are responsible for:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Providing accurate and current information</li>
                <li>Notifying us of any unauthorized use</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-warm-900">4. Content Guidelines</h2>
            <div className="mt-4 space-y-4 text-warm-700">
              <p>When submitting testimonies, you agree that your content will:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Be truthful and represent your genuine experience</li>
                <li>Not contain hate speech, profanity, or discriminatory language</li>
                <li>Not infringe on others' intellectual property rights</li>
                <li>Not contain harmful, threatening, or illegal content</li>
                <li>Be appropriate for all ages</li>
              </ul>
              <p className="mt-4">
                We reserve the right to review, edit, or remove any content that violates
                these guidelines without prior notice.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-warm-900">5. Content Ownership & License</h2>
            <div className="mt-4 space-y-4 text-warm-700">
              <p>
                You retain ownership of the testimonies you submit. By submitting content,
                you grant Metanoia Moment a worldwide, non-exclusive, royalty-free license to:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Host, store, and display your testimony on our platform</li>
                <li>Create mirrors and backups for preservation</li>
                <li>Share your testimony on affiliated platforms</li>
                <li>Use your content for promotional purposes</li>
              </ul>
              <p className="mt-4">
                You may request removal of your testimony at any time, though archived copies
                may persist for preservation purposes.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-warm-900">6. Prohibited Activities</h2>
            <div className="mt-4 text-warm-700">
              <p>You agree not to:</p>
              <ul className="mt-4 list-disc space-y-2 pl-6">
                <li>Use the platform for any unlawful purpose</li>
                <li>Impersonate another person or entity</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the platform</li>
                <li>Harvest or collect user information without consent</li>
                <li>Upload malicious code or harmful content</li>
                <li>Use automated systems to access the platform</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-warm-900">7. Moderation</h2>
            <p className="mt-4 text-warm-700">
              All testimonies are subject to review before publication. Our moderation team
              ensures content aligns with our mission and guidelines. We reserve the right
              to approve, reject, or remove any content at our discretion.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-warm-900">8. Donations</h2>
            <p className="mt-4 text-warm-700">
              Donations to Metanoia Moment support our mission and operations. All donations
              are voluntary and non-refundable. We are committed to using funds responsibly
              and transparently.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-warm-900">9. Disclaimer of Warranties</h2>
            <p className="mt-4 text-warm-700">
              The Platform is provided "as is" without warranties of any kind. We do not
              guarantee uninterrupted access, error-free operation, or that content will
              be preserved indefinitely. User testimonies represent individual experiences
              and do not constitute professional advice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-warm-900">10. Limitation of Liability</h2>
            <p className="mt-4 text-warm-700">
              Metanoia Moment shall not be liable for any indirect, incidental, or
              consequential damages arising from your use of the Platform. Our total
              liability shall not exceed the amount you have donated to us, if any.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-warm-900">11. Changes to Terms</h2>
            <p className="mt-4 text-warm-700">
              We may update these Terms of Service at any time. Significant changes will
              be communicated through the Platform. Continued use after changes constitutes
              acceptance of the new terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-warm-900">12. Contact</h2>
            <p className="mt-4 text-warm-700">
              For questions about these Terms of Service, please contact us at
              legal@metanoiamoment.org.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
