import { DocumentPreview, WorkflowDrawer, WorkflowMeta } from '../operations/WorkflowPrimitives';
import '../operations/portal-workflows.css';

export default function CrmDocumentDrawer({ open, onOpenChange, eyebrow, title, subtitle, media, metadata = [] }) {
  return (
    <WorkflowDrawer
      open={open}
      onOpenChange={onOpenChange}
      eyebrow={eyebrow}
      title={title || 'Submitted document'}
      subtitle={subtitle}
      width="780px"
      footer={<button type="button" className="btn btn-secondary" onClick={() => onOpenChange(false)}>Close</button>}
    >
      {metadata.length > 0 && (
        <dl className="workflow-document-meta">
          {metadata.map(({ label, value }) => <WorkflowMeta key={label} label={label} value={value} />)}
        </dl>
      )}
      <DocumentPreview media={media} title="Document preview" />
    </WorkflowDrawer>
  );
}
