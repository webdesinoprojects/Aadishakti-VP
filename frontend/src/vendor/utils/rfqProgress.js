const quotationLabels = {
  submitted: 'Submitted',
  under_review: 'Under review',
  accepted: 'Accepted',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
};

const assignmentLabels = {
  invited: 'Awaiting quotation',
  responded: 'Responded',
  awarded: 'Awarded',
  not_awarded: 'Not awarded',
};

export function getVendorRfqProgress(assignment) {
  const quotation = Array.isArray(assignment.quotation)
    ? assignment.quotation[0]
    : assignment.quotation;

  if (quotation) {
    const status = quotation.status || 'submitted';
    return { label: quotationLabels[status] || status.replaceAll('_', ' '), status };
  }

  const status = assignment.status || 'invited';
  return { label: assignmentLabels[status] || status.replaceAll('_', ' '), status };
}
