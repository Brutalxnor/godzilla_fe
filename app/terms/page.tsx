import type { Metadata } from "next";
import { LegalPage, Section, SUPPORT_EMAIL, OPERATOR } from "../components/shared/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Use · Godzilla",
  description: "The terms that apply when you use the Godzilla app.",
};

const mail = <a className="underline" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>;

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use" updated="October 21, 2026">
      <p>
        These terms (&ldquo;Terms&rdquo;) are an agreement between you and {OPERATOR} (&ldquo;we&rdquo;,
        &ldquo;us&rdquo;), the operator of the Godzilla mobile app and website (&ldquo;the app&rdquo;).
        By creating an account or using the app you agree to these Terms, our{" "}
        <a className="underline" href="/privacy">Privacy Policy</a> and our{" "}
        <a className="underline" href="/guidelines">Community Guidelines</a>. If you do not agree,
        do not use the app.
      </p>

      <Section heading="Your account">
        <ul className="list-disc space-y-2 pl-6">
          <li>You must be at least 13 years old to use Godzilla.</li>
          <li>
            Give accurate information when you sign up and keep your login details private. You are
            responsible for activity on your account.
          </li>
          <li>
            You can delete your account at any time in the app under{" "}
            <strong>Settings → Delete Account</strong>.
          </li>
        </ul>
      </Section>

      <Section heading="Subscriptions and payments">
        <ul className="list-disc space-y-2 pl-6">
          <li>
            Godzilla Premium is offered as an auto-renewing subscription (monthly, every 3 months or
            yearly). The price and period are shown before you buy.
          </li>
          <li>
            On iPhone, payment is charged to your Apple ID at confirmation of purchase. The
            subscription renews automatically unless it is cancelled at least 24 hours before the
            end of the current period, and your account is charged for renewal within 24 hours
            before the end of the current period.
          </li>
          <li>
            You can manage or cancel your subscription in your App Store account settings
            (<strong>Settings → [your name] → Subscriptions</strong>). Deleting the app or your
            account does not cancel an App Store subscription.
          </li>
          <li>
            Refunds for App Store purchases are handled by Apple under Apple&rsquo;s policies.
          </li>
        </ul>
      </Section>

      <Section heading="Your content">
        <p>
          You keep ownership of the posts, photos, videos, comments, programs and messages you
          share. By sharing content in the app you give us a worldwide, non-exclusive, royalty-free
          licence to host, store, display and distribute it within the app so the service can work.
          This licence ends when you delete the content or your account, except for copies other
          users have already shared or that we must keep by law.
        </p>
        <p>You are responsible for your content and confirm you have the right to share it.</p>
      </Section>

      <Section heading="Zero tolerance for objectionable content">
        <p>
          There is no tolerance for objectionable content or abusive users. You must not post or
          send content that is harassing, hateful, sexually explicit, violent, threatening, illegal,
          spam, or that infringes someone else&rsquo;s rights, or anything else our{" "}
          <a className="underline" href="/guidelines">Community Guidelines</a> prohibit.
        </p>
        <p>
          You can report content or users and block anyone from inside the app. We review reports
          within 24 hours, remove content that breaks these rules, and suspend or permanently remove
          the accounts of users who post it.
        </p>
      </Section>

      <Section heading="Not medical advice">
        <p>
          Workouts, nutrition plans, AI-generated suggestions and coach programs in Godzilla are for
          general information only and are not medical advice. Check with a doctor before starting
          a new exercise or diet program, especially if you have a health condition or injury. Stop
          exercising and seek help if you feel pain, dizziness or shortness of breath. You use the
          app&rsquo;s fitness content at your own risk.
        </p>
      </Section>

      <Section heading="Coaches">
        <p>
          Coaches are independent users, not our employees. They are responsible for the programs
          and advice they publish, and we do not guarantee any result from following them.
        </p>
      </Section>

      <Section heading="Acceptable use">
        <p>
          Do not misuse the app: no attempts to access other accounts, disrupt or reverse-engineer
          the service, scrape data, or use the app for anything unlawful.
        </p>
      </Section>

      <Section heading="Termination">
        <p>
          We may suspend or end your access if you break these Terms or the Community Guidelines.
          You can stop using the app and delete your account at any time.
        </p>
      </Section>

      <Section heading="Disclaimers and liability">
        <p>
          The app is provided &ldquo;as is&rdquo; without warranties of any kind. To the extent the
          law allows, we are not liable for indirect or consequential losses, or for content posted
          by other users.
        </p>
      </Section>

      <Section heading="Apple App Store terms">
        <p>If you downloaded Godzilla from the Apple App Store, the following also applies:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            These Terms are between you and us only, not Apple. We, not Apple, are solely
            responsible for the app and its content.
          </li>
          <li>
            Your licence to use the app is limited to Apple-branded devices you own or control, as
            permitted by the Usage Rules in the Apple Media Services Terms and Conditions.
          </li>
          <li>Apple has no obligation to provide any maintenance or support for the app.</li>
          <li>
            If the app fails to conform to any applicable warranty, you may notify Apple and Apple
            will refund the purchase price (if any). To the maximum extent the law allows, Apple has
            no other warranty obligation regarding the app.
          </li>
          <li>
            We, not Apple, are responsible for addressing any claims relating to the app, including
            product liability claims, claims that the app fails to meet legal or regulatory
            requirements, and consumer protection or privacy claims.
          </li>
          <li>
            If a third party claims the app infringes their intellectual property rights, we, not
            Apple, are responsible for the investigation, defence, settlement and discharge of that
            claim.
          </li>
          <li>
            You confirm you are not located in a country subject to a U.S. Government embargo or
            designated as a &ldquo;terrorist supporting&rdquo; country, and you are not listed on any
            U.S. Government list of prohibited or restricted parties.
          </li>
          <li>You must comply with any applicable third-party terms when using the app.</li>
          <li>
            Apple and its subsidiaries are third-party beneficiaries of these Terms and, once you
            accept them, Apple may enforce them against you.
          </li>
        </ul>
      </Section>

      <Section heading="Changes to these Terms">
        <p>
          We may update these Terms. We will post the new version on this page and update the date
          above. Continuing to use the app after a change means you accept the updated Terms.
        </p>
      </Section>

      <Section heading="Contact">
        <p>Questions about these Terms: {mail}</p>
      </Section>
    </LegalPage>
  );
}
