import type { Metadata } from "next";
import { LegalPage, Section, SUPPORT_EMAIL } from "../components/shared/LegalPage";

export const metadata: Metadata = {
  title: "Community Guidelines · Godzilla",
  description: "The rules that keep the Godzilla community safe and supportive.",
};

const mail = <a className="underline" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>;

export default function GuidelinesPage() {
  return (
    <LegalPage title="Community Guidelines" updated="October 21, 2026">
      <p>
        Godzilla is a place for athletes and coaches to train, share progress and support each
        other. These guidelines apply to everything you post, comment or send in the app, and are
        part of our <a className="underline" href="/terms">Terms of Use</a>. We have zero tolerance
        for objectionable content and abusive users.
      </p>

      <Section heading="Not allowed">
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Harassment and bullying:</strong> insulting, threatening, shaming or repeatedly
            contacting someone who doesn&rsquo;t want it, including body-shaming.
          </li>
          <li>
            <strong>Hate speech:</strong> attacking people for their race, ethnicity, religion,
            nationality, gender, sexual orientation, disability or any other protected trait.
          </li>
          <li>
            <strong>Nudity and sexual content:</strong> no sexually explicit images, videos or
            messages, and nothing sexual involving minors, ever.
          </li>
          <li>
            <strong>Violence and self-harm:</strong> threats, graphic violence, or content that
            encourages self-harm or eating disorders.
          </li>
          <li>
            <strong>Spam and scams:</strong> repeated unwanted promotion, fake engagement, misleading
            links or attempts to get money or personal details.
          </li>
          <li>
            <strong>Dangerous health misinformation:</strong> promoting illegal or dangerous
            substances, extreme diets, or false medical claims.
          </li>
          <li>
            <strong>Impersonation:</strong> pretending to be another person, coach or brand, or
            misrepresenting your qualifications.
          </li>
          <li>
            <strong>Illegal content:</strong> anything that breaks the law or someone else&rsquo;s
            copyright or privacy.
          </li>
        </ul>
      </Section>

      <Section heading="Reporting and blocking">
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Report:</strong> tap the menu on any post, comment, profile or chat and choose{" "}
            <strong>Report</strong>, then pick a reason.
          </li>
          <li>
            <strong>Block:</strong> choose <strong>Block</strong> from the same menu. Blocked users
            can&rsquo;t see your content or message you, and you won&rsquo;t see theirs. You can
            manage blocked accounts in <strong>Settings → Blocked accounts</strong>.
          </li>
          <li>You can also email {mail} about anything that worries you.</li>
        </ul>
      </Section>

      <Section heading="What happens after a report">
        <p>
          Our team reviews every report within 24 hours. Content that breaks these guidelines is
          removed, and the user who posted it may be warned, suspended or permanently banned,
          depending on how serious it is. Reports are confidential: the person you report is not told
          who reported them.
        </p>
      </Section>

      <Section heading="If you’re in danger">
        <p>
          If you or someone else is at immediate risk, contact your local emergency services first.
        </p>
      </Section>
    </LegalPage>
  );
}
