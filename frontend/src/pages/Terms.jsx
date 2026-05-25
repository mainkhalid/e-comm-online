import { Helmet } from 'react-helmet-async'

function Section({ title, children }) {
  return (
    <div className="mb-8">
      <h3 className="text-base font-bold mb-3" style={{ color: 'var(--text)' }}>{title}</h3>
      <div className="text-sm leading-relaxed space-y-3" style={{ color: 'var(--text-muted)' }}>
        {children}
      </div>
    </div>
  )
}

export default function Terms() {
  return (
    <>
      <Helmet>
        <title>Terms & Conditions — Nixxon Technologies</title>
        <meta name="description" content="Terms and conditions for using Nixxon Technologies." />
      </Helmet>

      <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
        <div style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)' }}>
          <div className="max-w-4xl mx-auto px-4 py-5">
            <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Home › Terms & Conditions</p>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Terms & Conditions</h1>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Last updated: May 2026</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div
            className="rounded-2xl p-6 sm:p-8"
            style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
          >
            <Section title="1. Acceptance of Terms">
              <p>
                By accessing and using the Nixxon Technologies / TechZone Kenya website and services, you agree to be
                bound by these Terms & Conditions. If you do not agree, please do not use our services.
              </p>
            </Section>

            <Section title="2. Products & Pricing">
              <p>
                All prices are listed in Kenyan Shillings (KES) and are inclusive of applicable taxes unless stated otherwise.
                We reserve the right to change prices at any time without prior notice. Promotional prices are valid only for the duration specified.
              </p>
              <p>
                Product descriptions and images are provided for informational purposes. We make every effort to ensure accuracy but do not guarantee that images, colours, or descriptions are error-free.
              </p>
            </Section>

            <Section title="3. Orders & Payment">
              <p>
                Placing an order constitutes an offer to purchase. We reserve the right to accept or decline any order.
                Payment is processed via M-Pesa STK push. By providing your phone number, you authorise us to initiate the payment prompt.
              </p>
              <p>
                Orders are confirmed only after successful payment. You will receive an order confirmation via email and SMS.
              </p>
            </Section>

            <Section title="4. Account Responsibility">
              <p>
                You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorised use of your account.
              </p>
            </Section>

            <Section title="5. Intellectual Property">
              <p>
                All content on this website — including text, graphics, logos, images, and software — is the property of Nixxon Technologies and is protected by Kenyan and international copyright law.
              </p>
            </Section>

            <Section title="6. Limitation of Liability">
              <p>
                Nixxon Technologies shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services, except as required by Kenyan consumer protection law.
              </p>
            </Section>

            <Section title="7. Governing Law">
              <p>
                These terms are governed by and construed in accordance with the laws of the Republic of Kenya.
                Any disputes shall be subject to the exclusive jurisdiction of the courts of Kenya.
              </p>
            </Section>

            <Section title="8. Changes to Terms">
              <p>
                We may update these terms from time to time. Continued use of our services after changes constitutes acceptance of the revised terms.
              </p>
            </Section>

            <div
              className="mt-8 p-4 rounded-xl text-sm"
              style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
            >
              <strong style={{ color: 'var(--text)' }}>Questions?</strong> Contact us at{' '}
              <strong style={{ color: 'var(--orange)' }}>support@nixxontechnologies.co.ke</strong>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
