import type { Metadata } from "next";
import { LegalPage, Section, SUPPORT_EMAIL, OPERATOR } from "../components/shared/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy · Godzilla",
  description: "How the Godzilla app collects, uses and protects your information.",
};

const mail = <a className="underline" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>;

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="October 19, 2026">
      <p>
        Godzilla (&ldquo;the app&rdquo;) is operated by {OPERATOR} (&ldquo;we&rdquo;, &ldquo;us&rdquo;).
        This policy explains what information we collect when you use the Godzilla mobile app and
        website, how we use it, and the choices you have.
      </p>

      <Section heading="Information we collect">
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Account information:</strong> your name, email address, password (stored hashed),
            and, if you choose to sign in with Apple or Google, the identifier and email those
            services share with us.
          </li>
          <li>
            <strong>Profile information:</strong> details you add such as profile photo, date of
            birth, phone number, city and country, bio, and, for coaches, specialization.
          </li>
          <li>
            <strong>Fitness information:</strong> goals, body measurements, injuries or limitations,
            training preferences, program enrollments and workout progress that you enter.
          </li>
          <li>
            <strong>Content you create:</strong> posts, photos, videos, comments, ratings and
            messages you send to coaches or other users.
          </li>
          <li>
            <strong>Purchases:</strong> subscription status and transaction identifiers from Apple.
            Payments are processed by Apple; we never receive your card details.
          </li>
          <li>
            <strong>Device information:</strong> a push notification token and basic device type so
            we can send you notifications you have allowed.
          </li>
        </ul>
        <p>We do not use third-party advertising or tracking SDKs, and we do not sell your information.</p>
      </Section>

      <Section heading="How we use your information">
        <ul className="list-disc space-y-2 pl-6">
          <li>To create and run your account and show your profile and content to other users.</li>
          <li>To deliver programs, track your progress, and enable messaging between athletes and coaches.</li>
          <li>To generate AI workouts and nutrition plans based on the details you provide.</li>
          <li>To verify subscriptions and unlock premium features.</li>
          <li>To send notifications such as new messages or activity on your posts.</li>
          <li>To keep the community safe, including reviewing reported content and enforcing our rules.</li>
          <li>To respond to support requests.</li>
        </ul>
      </Section>

      <Section heading="Service providers">
        <p>We share information only with providers that help us run the app, and only as needed:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li><strong>Supabase</strong>: database and authentication.</li>
          <li><strong>Amazon Web Services</strong>: servers and storage for photos and videos.</li>
          <li>
            <strong>AI model providers</strong> (such as OpenRouter and Groq): to generate AI
            workouts and nutrition plans. Only the details needed for the request are sent.
          </li>
          <li><strong>Apple</strong> and <strong>Google</strong>: sign-in, in-app purchases and push notifications.</li>
        </ul>
        <p>We may also disclose information if required by law or to protect the safety of our users.</p>
      </Section>

      <Section heading="Content visibility">
        <p>
          Posts, comments, your profile and coach programs are visible to other Godzilla users.
          Direct messages are visible only to the people in the conversation. You can block users
          and report content that breaks our rules.
        </p>
      </Section>

      <Section heading="Data retention and deletion">
        <p>
          We keep your information while your account is active. You can delete your account at
          any time in the app under <strong>Settings → Delete Account</strong>, which removes your
          account and associated personal data from our systems, except where we must keep limited
          records to meet legal obligations. You can also ask us to delete your data by emailing {mail}.
        </p>
        <p>
          Cancelling a subscription is done through your Apple ID settings; deleting your account
          does not cancel an active App Store subscription automatically.
        </p>
      </Section>

      <Section heading="Your rights">
        <p>
          Depending on where you live, you may have the right to access, correct, export or delete
          your personal information, or to object to certain processing. Contact us at {mail} and we
          will respond within 30 days.
        </p>
      </Section>

      <Section heading="Security">
        <p>
          We use encryption in transit, access controls and reputable infrastructure providers to
          protect your information. No method of transmission or storage is completely secure, but
          we work to protect your data.
        </p>
      </Section>

      <Section heading="Children">
        <p>
          Godzilla is not intended for children under 13, and we do not knowingly collect
          information from them. If you believe a child has given us information, contact us and we
          will delete it.
        </p>
      </Section>

      <Section heading="Changes to this policy">
        <p>
          We may update this policy from time to time. We will post the new version on this page and
          update the date above. Significant changes will be announced in the app.
        </p>
      </Section>

      <Section heading="Contact">
        <p>Questions about this policy or your data: {mail}</p>
      </Section>
    </LegalPage>
  );
}
