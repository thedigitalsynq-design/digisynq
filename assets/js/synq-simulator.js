/**
 * DIGISYNQ — Interactive Synq Simulator Console
 * Simulates real-time asset & counterparty coordination across the 6 pipeline stages.
 */
(function() {
  const SIMULATION_DATA = {
    'stage': {
      label: 'Vacant Atlanta Soundstage (15,000 sq ft)',
      matchedNode: 'Commercial Automotive Production (4-Day Sprint)',
      playbook: 'Mission 04: Soundstage Dark-Day Rescue',
      governance: 'Rule 06: Escrowed Milestone Payouts & Pre-cleared Load-in Terms',
      surplusYield: '+88% Dark-Day Utilization & Overhead Recovery',
      cycleTime: 'Turnaround compressed from 45 days to 72 hours'
    },
    'ip': {
      label: 'Shelved Sci-Fi Thriller Script (Turnaround IP)',
      matchedNode: 'Lead Guild Artisan + Indie Producer with Regional Tax Credit',
      playbook: 'Mission 02: Shelved IP Revival',
      governance: 'Rule 04: Transparent Net Revenue Participation & Defined Credits',
      surplusYield: '$1.4M Production Equity Unlocked via Private Co-Production',
      cycleTime: 'Assembly shortened by 4 months'
    },
    'optics': {
      label: 'Idle Master Prime Anamorphic Lens Fleet (UK)',
      matchedNode: 'Regional Streaming Mini-Series (London Unit)',
      playbook: 'Mission 05: Optical Kit Fleet Mobilization',
      governance: 'Rule 03: Verified Technical Inspection & Replacement Value Escrow',
      surplusYield: '+64% Hardware Fleet ROI with Zero Residual Depreciation',
      cycleTime: 'Direct equipment clearing in 24 hours'
    },
    'community': {
      label: 'Organic Indie Horror Fandom (120,000 Active Fans)',
      matchedNode: 'Independent Regional Cinema Exhibitor Circuit (8 Cities)',
      playbook: 'Mission 10: Theatrical Micro-Circuit',
      governance: 'Rule 07: Verified Ticketing Data & Audience Privacy Boundaries',
      surplusYield: '94% Theatrical Seat Occupancy Across 16 Screenings',
      cycleTime: 'Eventized distribution rollout in 14 days'
    },
    'distribution': {
      label: 'Completed Festival Drama (Sovereign Rights)',
      matchedNode: 'FAST Channel Syndicator + Regional TVOD Platform',
      playbook: 'Mission 11: FAST Syndication Rollout',
      governance: 'Rule 01 & 04: Unbundled Windowing & Non-Exclusive Licensing',
      surplusYield: 'Immediate Cashflow Monetization with Retained IP Ownership',
      cycleTime: 'Direct market release in under 3 weeks'
    }
  };

  function initSimulator() {
    const runBtn = document.getElementById('runSimulatorBtn');
    const assetSelect = document.getElementById('simAssetSelect');
    const stageOutput = document.getElementById('simStageStatus');
    const manifestBox = document.getElementById('simManifestResult');

    if (!runBtn || !assetSelect || !stageOutput || !manifestBox) return;

    runBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const assetKey = assetSelect.value;
      const data = SIMULATION_DATA[assetKey] || SIMULATION_DATA['stage'];

      runBtn.disabled = true;
      runBtn.innerText = 'COORDINATING PIPELINE...';
      manifestBox.style.display = 'none';
      stageOutput.style.display = 'block';

      const steps = [
        'STAGE 01 // MEASURING REAL ASSET CAPACITY & AVAILABILITY...',
        'STAGE 02 // ALGORITHMIC MATCHING ACROSS ECOSYSTEM NODES...',
        'STAGE 03 // ENFORCING 7 CLARITY RULES & MILESTONE ESCROW...',
        'STAGE 04 // READY FOR DEPLOYMENT: SYNQ MANIFEST GENERATED!'
      ];

      let stepIndex = 0;
      stageOutput.innerHTML = `<span class="mono" style="color:var(--accent-cyan);font-weight:700;">${steps[0]}</span>`;

      const interval = setInterval(() => {
        stepIndex++;
        if (stepIndex < steps.length) {
          stageOutput.innerHTML = `<span class="mono" style="color:var(--accent-cyan);font-weight:700;">${steps[stepIndex]}</span>`;
          if (window.DigiSynqSound) window.DigiSynqSound.playClick();
        } else {
          clearInterval(interval);
          renderManifest(data);
          runBtn.disabled = false;
          runBtn.innerText = 'RUN COORDINATION ENGINE';
          if (window.DigiSynqSound) window.DigiSynqSound.playSynqSuccess();
        }
      }, 550);
    });

    function renderManifest(data) {
      stageOutput.style.display = 'none';
      manifestBox.style.display = 'block';
      manifestBox.innerHTML = `
        <div style="border-top:1px solid rgba(56,189,248,0.3);padding-top:1.25rem;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem;margin-bottom:1rem;">
            <span class="mono" style="font-size:0.75rem;color:var(--accent-cyan);font-weight:800;letter-spacing:0.15em;">
              // SYNQ EXECUTION MANIFEST [VERIFIED]
            </span>
            <span class="mono" style="font-size:0.7rem;color:#94a3b8;background:rgba(255,255,255,0.06);padding:0.2rem 0.5rem;">
              REF: SYNQ-${Math.floor(Math.random() * 89999 + 10000)}
            </span>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:1rem;margin-bottom:1.25rem;font-size:0.9rem;">
            <div>
              <strong class="mono" style="font-size:0.72rem;color:#64748b;display:block;">INPUT ASSET:</strong>
              <span style="color:#ffffff;font-weight:600;">${data.label}</span>
            </div>
            <div>
              <strong class="mono" style="font-size:0.72rem;color:#64748b;display:block;">MATCHED COUNTERPARTY:</strong>
              <span style="color:var(--accent-cyan);font-weight:600;">${data.matchedNode}</span>
            </div>
            <div>
              <strong class="mono" style="font-size:0.72rem;color:#64748b;display:block;">ASSIGNED PLAYBOOK:</strong>
              <span style="color:#ffffff;">${data.playbook}</span>
            </div>
            <div>
              <strong class="mono" style="font-size:0.72rem;color:#64748b;display:block;">GOVERNANCE STANDARD:</strong>
              <span style="color:#ffffff;">${data.governance}</span>
            </div>
          </div>
          <div style="background:rgba(56,189,248,0.04);border:1px solid rgba(56,189,248,0.2);padding:1rem;border-radius:3px;margin-bottom:1.25rem;">
            <div class="mono" style="font-size:0.72rem;color:var(--accent-cyan);font-weight:700;margin-bottom:0.25rem;">SURPLUS IMPACT:</div>
            <div style="font-size:1.05rem;color:#ffffff;font-weight:700;margin-bottom:0.25rem;">${data.surplusYield}</div>
            <div style="font-size:0.85rem;color:#94a3b8;">${data.cycleTime}</div>
          </div>
          <div style="display:flex;gap:1rem;align-items:center;flex-wrap:wrap;">
            <a href="node-10.html" class="btn btn-primary" style="font-size:0.85rem;padding:0.6rem 1.25rem;">
              EXECUTE THIS SYNQ IN NODE 10 &rarr;
            </a>
            <span class="mono" style="font-size:0.75rem;color:#64748b;">// NO OBLIGATION &bull; CONFIDENTIAL INTAKE</span>
          </div>
        </div>
      `;
    }
  }

  document.addEventListener('DOMContentLoaded', initSimulator);
})();
