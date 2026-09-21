import { useMemo, useState } from 'react';
import { Check, Search } from 'lucide-react';
import { WorkflowEmpty } from './WorkflowPrimitives';

export default function RfqVendorPicker({ vendors, companyCode, selectedIds, assignedIds = [], onToggle, onSelectAll, onClearSelection }) {
  const [query, setQuery] = useState('');
  const alreadyAssigned = useMemo(() => new Set(assignedIds), [assignedIds]);
  const eligible = vendors.filter((vendor) => !companyCode
    || vendor.mappings?.some((mapping) => mapping.companyCode === companyCode));
  const visible = eligible.filter((vendor) =>
    `${vendor.displayName} ${vendor.loginId} ${vendor.email}`.toLowerCase().includes(query.trim().toLowerCase()));
  const availableIds = eligible.filter((vendor) => !alreadyAssigned.has(vendor.id)).map((vendor) => vendor.id);
  const allSelected = availableIds.length > 0 && availableIds.every((id) => selectedIds.includes(id));

  return <div className="workflow-recipient-picker">
    <label className="workflow-vendor-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search active vendors" aria-label="Search active vendors" /></label>
    <div className="workflow-recipient-actions">
      <span>{eligible.length} eligible vendor{eligible.length === 1 ? '' : 's'}{companyCode ? ` for ${companyCode}` : ' across all companies'}</span>
      <div><button type="button" disabled={!availableIds.length || allSelected} onClick={() => onSelectAll(availableIds)}>Select all eligible</button><button type="button" disabled={!selectedIds.length} onClick={onClearSelection}>Clear selection</button></div>
    </div>
    <div className="workflow-vendor-list">
      {visible.map((vendor) => {
        const assigned = alreadyAssigned.has(vendor.id);
        const selected = assigned || selectedIds.includes(vendor.id);
        return <label key={vendor.id} className={selected ? 'is-selected' : ''}>
          <input type="checkbox" disabled={assigned} checked={selected} onChange={() => onToggle(vendor.id)} />
          <span><strong>{vendor.displayName}</strong><small>{assigned ? 'Already assigned' : vendor.loginId} · {vendor.email || 'No email'}</small></span>
          <Check size={17} />
        </label>;
      })}
      {!eligible.length && <WorkflowEmpty title="No eligible vendors" copy="Create or activate a vendor account mapped to this company." />}
      {eligible.length > 0 && !visible.length && <WorkflowEmpty title="No matching vendors" copy="Try a different name or login ID." />}
    </div>
  </div>;
}
