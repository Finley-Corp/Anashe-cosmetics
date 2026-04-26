import type { Metadata } from 'next';
import { FeedbackForm } from './feedback-form';

export const metadata: Metadata = {
  title: 'Share Feedback',
  description: 'Share your experience with Anashe. Approved feedback appears in our homepage testimonials.',
};

export default function FeedbackPage() {
  return (
    <div className="mx-auto max-w-[900px] px-4 py-16 md:px-6">
      <FeedbackForm />
    </div>
  );
}
