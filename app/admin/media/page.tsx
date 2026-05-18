import { MediaLibrary } from "@/components/admin/MediaLibrary";

export default function MediaPage() {
  return (
    <div>
      <h1 className="font-display text-section text-ink">Media</h1>
      <p className="font-body text-small text-ink-2 mt-1 mb-6">
        Upload and manage images. Use “Copy URL” to paste an image into a page
        component.
      </p>
      <MediaLibrary />
    </div>
  );
}
