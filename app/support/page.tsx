import type { Metadata } from "next";
import { LegalPage, Section, SUPPORT_EMAIL } from "../components/shared/LegalPage";

export const metadata: Metadata = {
  title: "Support · Godzilla",
  description: "Get help with the Godzilla app.",
};

const mail = <a className="underline" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>;

export default function SupportPage() {
  return (
    <LegalPage title="Support">
      <p>
        Need help with Godzilla? Email us at {mail} with a short description of the issue and the
        email address on your account. We usually reply within 2 business days.
      </p>

      <Section heading="Frequently asked questions">
        <h3 className="font-semibold">How do I manage or cancel my subscription?</h3>
        <p>
          Subscriptions are billed through your Apple ID. On your iPhone, open{" "}
          <strong>Settings → [your name] → Subscriptions → Godzilla</strong> to change plans or
          cancel. Cancel at least 24 hours before the renewal date to avoid being charged for the
          next period.
        </p>

        <h3 className="font-semibold">I paid but premium isn&rsquo;t unlocked.</h3>
        <p>
          Open the subscription screen in the app and tap <strong>Restore Purchases</strong>, making
          sure you are signed in with the same Apple ID you paid with. If it still doesn&rsquo;t
          unlock, email us.
        </p>

        <h3 className="font-semibold">How do I get a refund?</h3>
        <p>
          Refunds for App Store purchases are handled by Apple. Request one at{" "}
          <a className="underline" href="https://reportaproblem.apple.com">reportaproblem.apple.com</a>.
        </p>

        <h3 className="font-semibold">I forgot my password.</h3>
        <p>
          On the login screen tap <strong>Forgot password</strong> and follow the link sent to your
          email.
        </p>

        <h3 className="font-semibold">How do I report or block someone?</h3>
        <p>
          Tap the menu on any post, comment or profile and choose <strong>Report</strong> or{" "}
          <strong>Block</strong>. We review reports and remove content that breaks our rules.
        </p>

        <h3 className="font-semibold">How do I delete my account?</h3>
        <p>
          In the app, go to <strong>Settings → Delete Account</strong>. This permanently removes your
          account and personal data. You can also email us to request deletion. See our{" "}
          <a className="underline" href="/privacy">Privacy Policy</a> for details.
        </p>
      </Section>
    </LegalPage>
  );
}
