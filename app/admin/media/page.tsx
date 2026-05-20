import { MediaLibrary } from "@/components/admin/MediaLibrary";

export default function MediaPage() {
  return (
    <div>
      <h1 className="font-display text-section text-ink">Media</h1>
      <p className="font-body text-small text-ink-secondary mt-1 mb-6">
        Upload and manage images. In the page editor, use “Browse media” on image
        fields, or copy URLs from here.
      </p>
      <MediaLibrary />
    </div>
  );
}
