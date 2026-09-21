const vendorConnections = new Map();

export function streamVendorWorkflowEvents(accountId, req, res) {
  res.set({
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    'X-Accel-Buffering': 'no',
  });
  res.flushHeaders();
  res.write(': connected\n\n');

  const connections = vendorConnections.get(accountId) || new Set();
  connections.add(res);
  vendorConnections.set(accountId, connections);

  const heartbeat = setInterval(() => res.write(': heartbeat\n\n'), 25000);
  req.on('close', () => {
    clearInterval(heartbeat);
    connections.delete(res);
    if (connections.size === 0) vendorConnections.delete(accountId);
  });
}

export function notifyVendorWorkflowChanged(accountId) {
  for (const res of vendorConnections.get(accountId) || []) {
    res.write('event: workflow-updated\ndata: {}\n\n');
  }
}
