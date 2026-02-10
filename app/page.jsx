'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const TESLA_VIN_PREFIXES = [
    '5YJ', // Model S/X Fremont
    '7SA', // Model 3/Y Shanghai
    '5YJ3', // Model 3 Fremont
    '5YJY', // Model Y Fremont
    'LRW', // Model 3 Shanghai (older)
    '7SL', // Model S/X Shanghai
];

function isValidVINFormat(vin) {
    if (!vin || vin.length !== 17) return false;
    const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
    return vinRegex.test(vin);
}

function isTeslaVIN(vin) {
    if (!isValidVINFormat(vin)) return false;
    return TESLA_VIN_PREFIXES.some(prefix => vin.startsWith(prefix));
}

function VinBreakdown({ vin, data }) {
    if (!data || Object.keys(data).length === 0) return null;

    const positionLabels = {
        'positions1to3': 'Positions 1-3 (WMI)',
        'position4': 'Position 4',
        'position5': 'Position 5',
        'position6': 'Position 6',
        'position7': 'Position 7',
        'position8': 'Position 8',
        'position9': 'Position 9',
        'position10': 'Position 10',
        'position11': 'Position 11',
        'positions12to17': 'Positions 12-17'
    };

    const getVinChars = (key) => {
        if (key === 'positions1to3') return vin ? vin.substring(0, 3) : '';
        if (key === 'positions12to17') return vin ? vin.substring(11, 17) : '';
        const posMap = {
            'position4': 3,
            'position5': 4,
            'position6': 5,
            'position7': 6,
            'position8': 7,
            'position9': 8,
            'position10': 9,
            'position11': 10
        };
        const pos = posMap[key];
        return pos !== undefined && vin ? vin[pos] : '';
    };

    return (
        <div style={{
            backgroundColor: '#f9fafb',
            borderRadius: '12px',
            padding: 'clamp(16px, 3vw, 20px)',
            border: '1px solid #e5e7eb'
        }}>
            <h3 style={{
                fontSize: 'clamp(16px, 3vw, 18px)',
                fontWeight: 600,
                margin: '0 0 clamp(16px, 3vw, 20px) 0',
                color: '#111827',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                flexWrap: 'wrap'
            }}>
                                <span style={{ color: '#E31937', display: 'flex', alignItems: 'center', flexShrink: 0 }}>{Icons.vin}</span>
                VIN Breakdown
            </h3>
            
            {vin && (
                <div style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    padding: 'clamp(12px, 2vw, 16px)',
                    marginBottom: 'clamp(16px, 3vw, 20px)',
                    border: '1px solid #e5e7eb',
                    fontFamily: 'monospace',
                    fontSize: 'clamp(14px, 3vw, 20px)',
                    letterSpacing: 'clamp(2px, 0.5vw, 4px)',
                    textAlign: 'center',
                    fontWeight: 600,
                    color: '#111827',
                    overflowX: 'auto'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '2px' }}>
                        {vin.split('').map((char, index) => (
                            <span key={index} style={{
                                display: 'inline-block',
                                minWidth: 'clamp(18px, 3vw, 24px)',
                                textAlign: 'center',
                                borderBottom: '2px solid #E31937',
                                paddingBottom: '4px'
                            }}>{char}</span>
                        ))}
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {Object.entries(data).map(([key, value]) => {
                    if (value === null || value === undefined || value === '') return null;
                    const vinChars = getVinChars(key);
                    const label = positionLabels[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
                    
                    return (
                        <div key={key} style={{
                            backgroundColor: '#ffffff',
                            borderRadius: '8px',
                            padding: 'clamp(12px, 2vw, 16px)',
                            border: '1px solid #e5e7eb'
                        }}>
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                alignItems: 'center',
                                gap: 'clamp(8px, 2vw, 12px)',
                                marginBottom: '8px'
                            }}>
                                <span style={{
                                    backgroundColor: '#E31937',
                                    color: 'white',
                                    padding: 'clamp(3px, 1vw, 4px) clamp(10px, 2vw, 12px)',
                                    borderRadius: '6px',
                                    fontSize: 'clamp(12px, 2.5vw, 14px)',
                                    fontWeight: 600,
                                    fontFamily: 'monospace',
                                    flexShrink: 0
                                }}>
                                    {vinChars || 'N/A'}
                                </span>
                                <span style={{
                                    color: '#111827',
                                    fontWeight: 600,
                                    fontSize: 'clamp(14px, 3vw, 16px)',
                                    wordBreak: 'break-word'
                                }}>
                                    {label}
                                </span>
                            </div>
                            <p style={{
                                color: '#374151',
                                margin: 0,
                                lineHeight: '1.6',
                                fontSize: 'clamp(13px, 2.5vw, 14px)',
                                wordBreak: 'break-word'
                            }}>
                                {String(value)}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

const Icons = {
    validation: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2ZM8.70711 13.7071L5.29289 10.2929C4.90237 9.90237 4.90237 9.2692 5.29289 8.87868C5.68342 8.48815 6.31658 8.48815 6.70711 8.87868L9 11.1716L13.2929 6.87868C13.6834 6.48815 14.3166 6.48815 14.7071 6.87868C15.0976 7.2692 15.0976 7.90237 14.7071 8.29289L9.70711 13.2929C9.31658 13.6834 8.68342 13.6834 8.29289 13.2929L8.70711 13.7071Z" fill="currentColor"/>
        </svg>
    ),
    vehicle: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 8L5 6H15L17 8V14H15V16H13V14H7V16H5V14H3V8ZM5.5 9C4.67157 9 4 9.67157 4 10.5C4 11.3284 4.67157 12 5.5 12C6.32843 12 7 11.3284 7 10.5C7 9.67157 6.32843 9 5.5 9ZM14.5 9C13.6716 9 13 9.67157 13 10.5C13 11.3284 13.6716 12 14.5 12C15.3284 12 16 11.3284 16 10.5C16 9.67157 15.3284 9 14.5 9Z" fill="currentColor"/>
        </svg>
    ),
    performance: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 2L12.5 7.5L18 8L14 12L15 18L10 15L5 18L6 12L2 8L7.5 7.5L10 2Z" fill="currentColor"/>
        </svg>
    ),
    battery: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="6" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="2" fill="none"/>
            <rect x="15" y="8" width="1" height="4" fill="currentColor"/>
            <rect x="5" y="8" width="8" height="4" fill="currentColor"/>
        </svg>
    ),
    batteryHealth: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2Z" stroke="currentColor" strokeWidth="2" fill="none"/>
            <rect x="5" y="7" width="10" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            <rect x="15" y="9" width="1" height="2" fill="currentColor"/>
            <path d="M7 10L9 12L13 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    ),
    connectivity: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 2C7.23858 2 5 4.23858 5 7C5 7.55228 5.44772 8 6 8C6.55228 8 7 7.55228 7 7C7 5.34315 8.34315 4 10 4C11.6569 4 13 5.34315 13 7C13 7.55228 13.4477 8 14 8C14.5523 8 15 7.55228 15 7C15 4.23858 12.7614 2 10 2Z" fill="currentColor"/>
            <path d="M3 10C3 9.44772 3.44772 9 4 9C4.55228 9 5 9.44772 5 10C5 12.7614 7.23858 15 10 15C12.7614 15 15 12.7614 15 10C15 9.44772 15.4477 9 16 9C16.5523 9 17 9.44772 17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10Z" fill="currentColor"/>
            <circle cx="10" cy="10" r="2" fill="currentColor"/>
        </svg>
    ),
    safety: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 2L3 5V9C3 13.5 6 16.5 10 18C14 16.5 17 13.5 17 9V5L10 2ZM10 4.5L15 6.5V9C15 12.5 13 15 10 16.5C7 15 5 12.5 5 9V6.5L10 4.5Z" fill="currentColor"/>
        </svg>
    ),
    package: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 2L3 6V14L10 18L17 14V6L10 2Z" stroke="currentColor" strokeWidth="2" fill="none"/>
            <path d="M3 6L10 10M10 10L17 6M10 10V18" stroke="currentColor" strokeWidth="2"/>
        </svg>
    ),
    warranty: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 2L3 6V14L10 18L17 14V6L10 2Z" fill="currentColor"/>
            <path d="M8 10L9.5 11.5L12 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    ),
    service: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 2L3 5V9C3 13.5 6 16.5 10 18C14 16.5 17 13.5 17 9V5L10 2Z" stroke="currentColor" strokeWidth="2" fill="none"/>
            <path d="M10 6V10L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
    ),
    market: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 4V16H17V4H5ZM4 2H18C18.5523 2 19 2.44772 19 3V17C19 17.5523 18.5523 18 18 18H4C3.44772 18 3 17.5523 3 17V3C3 2.44772 3.44772 2 4 2Z" fill="currentColor"/>
            <path d="M7 6H13M7 10H13M7 14H11" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
    ),
    production: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="5" width="14" height="12" rx="1" fill="currentColor"/>
            <path d="M3 8H17M6 5V3C6 2.44772 6.44772 2 7 2H13C13.5523 2 14 2.44772 14 3V5" stroke="white" strokeWidth="1.5"/>
            <circle cx="7" cy="12" r="1" fill="white"/>
            <circle cx="10" cy="12" r="1" fill="white"/>
            <circle cx="13" cy="12" r="1" fill="white"/>
        </svg>
    ),
    charging: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 2L3 5V9C3 13.5 6 16.5 10 18C14 16.5 17 13.5 17 9V5L10 2Z" fill="currentColor"/>
            <path d="M10 6L7 11H10L9 14L13 9H10L10 6Z" fill="white"/>
        </svg>
    ),
    software: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="14" height="12" rx="1" stroke="currentColor" strokeWidth="2" fill="none"/>
            <path d="M6 8H14M6 11H12M6 14H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="15" cy="6" r="1.5" fill="currentColor"/>
        </svg>
    ),
    vin: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="4" width="16" height="12" rx="1" stroke="currentColor" strokeWidth="2" fill="none"/>
            <path d="M5 8H15M5 11H15M5 14H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
    ),
    internet: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" fill="none"/>
            <path d="M10 2C5.58172 2 2 5.58172 2 10M18 10C18 14.4183 14.4183 18 10 18M3.5 6.5L16.5 13.5M16.5 6.5L3.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="10" cy="10" r="2" fill="currentColor"/>
        </svg>
    ),
    keyFindings: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 3H4C3.44772 3 3 3.44772 3 4V16C3 16.5523 3.44772 17 4 17H16C16.5523 17 17 16.5523 17 16V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M14 2L18 6L10 14H7V11L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    ),
    recommendations: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 2L12.5 7.5L18 8L14 12L15 18L10 15L5 18L6 12L2 8L7.5 7.5L10 2Z" fill="currentColor"/>
        </svg>
    ),
    insights: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2ZM11 14H9V12H11V14ZM11 10H9V6H11V10Z" fill="currentColor"/>
        </svg>
    ),
    notableFeatures: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 2L12 7L18 8L14 12L15 18L10 15L5 18L6 12L2 8L8 7L10 2Z" fill="currentColor"/>
        </svg>
    ),
    considerations: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2ZM9 13V11H11V13H9ZM9 7V9H11V7H9Z" fill="currentColor"/>
        </svg>
    )
};

function TableOfContents({ report }) {
    const sections = [];
    
    if (report.vinBreakdown) sections.push({ title: 'VIN Breakdown', icon: Icons.vin });
    if (report.validation) sections.push({ title: 'Validation', icon: Icons.validation });
    if (report.vehicleConfiguration) sections.push({ title: 'Vehicle Configuration', icon: Icons.vehicle });
    if (report.performanceSpecifications) sections.push({ title: 'Performance Specifications', icon: Icons.performance });
    if (report.batteryInsights) sections.push({ title: 'Battery Insights', icon: Icons.battery });
    if (report.batteryHealth) sections.push({ title: 'Battery Health', icon: Icons.batteryHealth });
    if (report.connectivityInsights) sections.push({ title: 'Connectivity Insights', icon: Icons.connectivity });
    if (report.safetyFeatures) sections.push({ title: 'Safety Features', icon: Icons.safety });
    if (report.featurePackages) sections.push({ title: 'Feature Packages', icon: Icons.package });
    if (report.warrantyInformation) sections.push({ title: 'Warranty Information', icon: Icons.warranty });
    if (report.serviceAndMaintenance) sections.push({ title: 'Service & Maintenance', icon: Icons.service });
    if (report.marketInformation) sections.push({ title: 'Market Information', icon: Icons.market });
    if (report.productionDetails) sections.push({ title: 'Production Details', icon: Icons.production });
    if (report.chargingCompatibility) sections.push({ title: 'Charging Compatibility', icon: Icons.charging });
    if (report.softwareAndUpdates) sections.push({ title: 'Software & Updates', icon: Icons.software });
    if (report.internetInsights) sections.push({ title: 'Internet Insights', icon: Icons.internet });
    if (report.analysis?.keyFindings) sections.push({ title: 'Key Findings', icon: Icons.keyFindings });
    if (report.analysis?.recommendations) sections.push({ title: 'Recommendations', icon: Icons.recommendations });
    if (report.analysis?.insights) sections.push({ title: 'Additional Insights', icon: Icons.insights });
    if (report.analysis?.notableFeatures) sections.push({ title: 'Notable Features', icon: Icons.notableFeatures });
    if (report.analysis?.considerations) sections.push({ title: 'Important Considerations', icon: Icons.considerations });

    if (sections.length === 0) return null;

    return (
        <div style={{
            backgroundColor: '#f9fafb',
            borderRadius: '12px',
            padding: 'clamp(16px, 3vw, 20px)',
            border: '1px solid #e5e7eb'
        }}>
            <h2 style={{
                fontSize: 'clamp(18px, 4vw, 20px)',
                fontWeight: 600,
                margin: '0 0 clamp(12px, 2vw, 16px) 0',
                color: '#111827',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                flexWrap: 'wrap'
            }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 4H17M3 8H17M3 12H17M3 16H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Table of Contents
            </h2>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 250px), 1fr))',
                gap: '12px'
            }}>
                {sections.map((section, index) => (
                    <div key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        backgroundColor: '#ffffff',
                        borderRadius: '6px',
                        border: '1px solid #e5e7eb'
                    }}>
                        {section.icon && (
                            <span style={{ color: '#E31937', display: 'flex', alignItems: 'center' }}>
                                {section.icon}
                            </span>
                        )}
                        <span style={{
                            fontSize: '14px',
                            color: '#374151',
                            fontWeight: 500
                        }}>
                            {section.title}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ReportSection({ title, data, icon }) {
    if (!data || Object.keys(data).length === 0) return null;

    return (
        <div style={{
            backgroundColor: '#f9fafb',
            borderRadius: '12px',
            padding: 'clamp(16px, 3vw, 20px)',
            border: '1px solid #e5e7eb'
        }}>
            <h3 style={{
                fontSize: 'clamp(16px, 3vw, 18px)',
                fontWeight: 600,
                margin: '0 0 clamp(12px, 2vw, 16px) 0',
                color: '#111827',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                flexWrap: 'wrap'
            }}>
                {icon && <span style={{ color: '#E31937', display: 'flex', alignItems: 'center', flexShrink: 0 }}>{icon}</span>}
                {title}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {Object.entries(data).map(([key, value]) => {
                    if (value === null || value === undefined || value === '') return null;
                    const displayKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
                    return (
                        <div key={key} style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            padding: '8px 0',
                            borderBottom: '1px solid #e5e7eb'
                        }}>
                            <span style={{ color: '#6b7280', fontWeight: 500, fontSize: 'clamp(13px, 2.5vw, 14px)' }}>{displayKey}:</span>
                            <span style={{ color: '#111827', fontWeight: 400, fontSize: 'clamp(13px, 2.5vw, 14px)', wordBreak: 'break-word' }}>
                                {Array.isArray(value) ? value.join(', ') : String(value)}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function SampleReportSection({ title, data, icon }) {
    if (!data || Object.keys(data).length === 0) return null;

    const sampleData = Object.entries(data).slice(0, 2);

    return (
        <div style={{
            backgroundColor: '#f9fafb',
            borderRadius: '12px',
            padding: 'clamp(16px, 3vw, 20px)',
            border: '1px solid #e5e7eb'
        }}>
            <h3 style={{
                fontSize: 'clamp(16px, 3vw, 18px)',
                fontWeight: 600,
                margin: '0 0 clamp(12px, 2vw, 16px) 0',
                color: '#111827',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                flexWrap: 'wrap'
            }}>
                {icon && <span style={{ color: '#E31937', display: 'flex', alignItems: 'center', flexShrink: 0 }}>{icon}</span>}
                {title}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {sampleData.map(([key, value]) => {
                    if (value === null || value === undefined || value === '') return null;
                    const displayKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim();
                    return (
                        <div key={key} style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            padding: '8px 0',
                            borderBottom: '1px solid #e5e7eb'
                        }}>
                            <span style={{ color: '#6b7280', fontWeight: 500, fontSize: 'clamp(13px, 2.5vw, 14px)' }}>{displayKey}:</span>
                            <span style={{ color: '#111827', fontWeight: 400, fontSize: 'clamp(13px, 2.5vw, 14px)', wordBreak: 'break-word' }}>
                                {Array.isArray(value) ? value.slice(0, 2).join(', ') + (value.length > 2 ? '...' : '') : String(value).substring(0, 50) + (String(value).length > 50 ? '...' : '')}
                            </span>
                        </div>
                    );
                })}
                <div style={{
                    padding: '8px 0',
                    color: '#6b7280',
                    fontSize: 'clamp(12px, 2.5vw, 14px)',
                    fontStyle: 'italic'
                }}>
                    + {Object.keys(data).length - sampleData.length} more details in full report
                </div>
            </div>
        </div>
    );
}

function PageContent() {
    const searchParams = useSearchParams();
    const [vin, setVin] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState(null);
    const [apiError, setApiError] = useState('');
    const [showFinalReport, setShowFinalReport] = useState(false);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [paymentVerified, setPaymentVerified] = useState(null);
    const videoRef = useRef(null);

    useEffect(() => {
        if (!videoRef.current) return;
        if (loading) {
            videoRef.current.play().catch(() => {});
        } else {
            videoRef.current.pause();
        }
    }, [loading]);

    const checkPaymentStatus = async (vinToCheck) => {
        if (!vinToCheck) return false;
        const paymentKey = `payment_${vinToCheck}`;
        const paymentData = localStorage.getItem(paymentKey);
        if (paymentData) {
            try {
                const parsed = JSON.parse(paymentData);
                // If we have a sessionId, verify it server-side
                if (parsed.sessionId && parsed.paid === true) {
                    try {
                        const response = await fetch('/api/verify-payment', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ vin: vinToCheck, sessionId: parsed.sessionId }),
                        });
                        const data = await response.json();
                        if (data.verified) {
                            return true;
                        } else {
                            // Payment verification failed, clear invalid data
                            localStorage.removeItem(paymentKey);
                            return false;
                        }
                    } catch (e) {
                        console.error('Payment verification error:', e);
                        // On error, fall back to localStorage check but log warning
                        return parsed.paid === true;
                    }
                }
                return parsed.paid === true;
            } catch (e) {
                return false;
            }
        }
        return false;
    };

    useEffect(() => {
        const loadReportAfterPayment = async () => {
            const vinParam = searchParams.get('vin');
            const paid = searchParams.get('paid');
            
            if (vinParam) {
                // Check payment status (async verification)
                const hasPaid = await checkPaymentStatus(vinParam);
                
                if (hasPaid) {
                    // Check if report exists in sessionStorage
                    const storedReport = sessionStorage.getItem(`report_${vinParam}`);
                    if (storedReport) {
                        try {
                            const parsedReport = JSON.parse(storedReport);
                            setReport(parsedReport);
                            setShowFinalReport(true);
                            return;
                        } catch (e) {
                            console.error('Failed to parse stored report:', e);
                        }
                    }
                    
                    // If report is already loaded and matches VIN, show final report
                    if (report && vinParam === report.vin) {
                        setShowFinalReport(true);
                    }
                } else if (paid === 'true') {
                    // If paid param is true but verification failed, reset to sample report
                    setShowFinalReport(false);
                }
            }
        };
        
        loadReportAfterPayment();
    }, [searchParams]);

    useEffect(() => {
        const verifyPaymentForFinalReport = async () => {
            if (report && showFinalReport && report.vin) {
                const hasPaid = await checkPaymentStatus(report.vin);
                setPaymentVerified(hasPaid);
                if (!hasPaid) {
                    setShowFinalReport(false);
                }
            } else if (!showFinalReport) {
                setPaymentVerified(null);
            }
        };
        if (report && showFinalReport) {
            verifyPaymentForFinalReport();
        } else {
            setPaymentVerified(null);
        }
    }, [report, showFinalReport]);

    const startStripeCheckout = async (vin) => {
        setApiError('');
        setCheckoutLoading(true);
        try {
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ vin }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to create checkout session');
            if (data.url) {
                window.location.href = data.url;
            } else {
                setApiError('Checkout URL was not returned. Please check Stripe configuration.');
                setCheckoutLoading(false);
            }
        } catch (err) {
            setApiError(err.message || 'Failed to start checkout process');
            setCheckoutLoading(false);
        }
    };

    const handleShowFinalReport = async () => {
        if (!report || !report.vin) {
            const vinParam = searchParams.get('vin');
            if (vinParam) {
                const storedReport = sessionStorage.getItem(`report_${vinParam}`);
                if (storedReport) {
                    try {
                        const parsedReport = JSON.parse(storedReport);
                        setReport(parsedReport);
                        const hasPaid = await checkPaymentStatus(vinParam);
                        if (hasPaid) {
                            setShowFinalReport(true);
                            return;
                        }
                        await startStripeCheckout(vinParam);
                        return;
                    } catch (e) {
                        console.error('Failed to parse stored report:', e);
                    }
                }
            }
            return;
        }

        const hasPaid = await checkPaymentStatus(report.vin);
        if (hasPaid) {
            setShowFinalReport(true);
        } else {
            await startStripeCheckout(report.vin);
        }
    };

    const handleVinChange = (e) => {
        const value = e.target.value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, '');
        setVin(value);
        setReport(null);
        setApiError('');
        setShowFinalReport(false);
        
        if (value.length === 0) {
            setError('');
        } else if (value.length < 17) {
            setError('');
        } else if (!isValidVINFormat(value)) {
            setError('Invalid VIN format. VINs cannot contain I, O, or Q.');
        } else if (!isTeslaVIN(value)) {
            setError('This VIN does not appear to be a Tesla VIN.');
        } else {
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (vin.length === 17 && !error && isTeslaVIN(vin)) {
            setLoading(true);
            setApiError('');
            setReport(null);

            try {
                const response = await fetch('/api/analyze-vin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ vin }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to analyze VIN');
                }

                setReport(data.report);
                setShowFinalReport(false);
                // Store report in sessionStorage for payment redirect
                if (data.report && data.report.vin) {
                    sessionStorage.setItem(`report_${data.report.vin}`, JSON.stringify(data.report));
                }
            } catch (err) {
                setApiError(err.message || 'An error occurred while generating the report');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleNewReport = () => {
        // Clear sessionStorage
        if (report && report.vin) {
            sessionStorage.removeItem(`report_${report.vin}`);
        }
        setReport(null);
        setVin('');
        setError('');
        setApiError('');
        setShowFinalReport(false);
    };


    const handlePrint = () => {
        window.print();
    };

    if (report && !showFinalReport) {
        return (
            <div style={{
                minHeight: '100vh',
                padding: 'clamp(20px, 5vw, 40px) clamp(16px, 4vw, 20px)',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                position: 'relative'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'clamp(16px, 3vw, 24px)'
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        marginBottom: '8px'
                    }}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            flex: 1
                        }}>
                            <h1 style={{
                                fontSize: 'clamp(24px, 5vw, 28px)',
                                fontWeight: 600,
                                margin: 0,
                                color: '#111827'
                            }}>Sample Report</h1>
                            <p style={{
                                fontSize: 'clamp(14px, 3vw, 16px)',
                                color: '#6b7280',
                                margin: 0
                            }}>VIN: {report.vin}</p>
                        </div>
                        <button
                            onClick={handleShowFinalReport}
                            disabled={checkoutLoading}
                            style={{
                                padding: 'clamp(10px, 2vw, 12px) clamp(16px, 4vw, 24px)',
                                backgroundColor: checkoutLoading ? '#9ca3af' : '#E31937',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: checkoutLoading ? 'not-allowed' : 'pointer',
                                fontSize: 'clamp(14px, 3vw, 16px)',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                width: '100%',
                                minHeight: '44px'
                            }}
                        >
                            {checkoutLoading ? (
                                <>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ animation: 'spin 1s linear infinite' }}>
                                        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="2" strokeDasharray="22" strokeDashoffset="11" strokeLinecap="round" opacity="0.5"/>
                                    </svg>
                                    Loading...
                                </>
                            ) : (
                                <>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    Go to Final Report
                                </>
                            )}
                        </button>
                        {apiError && (
                            <p style={{ fontSize: '14px', color: '#dc2626', margin: '8px 0 0', textAlign: 'center' }}>
                                {apiError}
                            </p>
                        )}
                    </div>

                    <TableOfContents report={report} />

                    {report.analysis?.summary && (
                        <div style={{
                            backgroundColor: '#f5f5f5',
                            border: '1px solid #E31937',
                            borderRadius: '12px',
                            padding: 'clamp(16px, 3vw, 20px)',
                            marginBottom: '8px'
                        }}>
                            <h2 style={{
                                fontSize: 'clamp(18px, 4vw, 20px)',
                                fontWeight: 600,
                                margin: '0 0 clamp(10px, 2vw, 12px) 0',
                                color: '#171717',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                flexWrap: 'wrap'
                            }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="#171717"/>
                                </svg>
                                Summary
                            </h2>
                            <p style={{
                                fontSize: 'clamp(14px, 3vw, 16px)',
                                color: '#171717',
                                margin: 0,
                                lineHeight: '1.6',
                                wordBreak: 'break-word'
                            }}>{report.analysis.summary}</p>
                        </div>
                    )}

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'clamp(16px, 3vw, 20px)'
                    }}>
                        {report.vinBreakdown && (
                            <div style={{
                                backgroundColor: '#f9fafb',
                                borderRadius: '12px',
                                padding: 'clamp(16px, 3vw, 20px)',
                                border: '1px solid #e5e7eb'
                            }}>
                                <h3 style={{
                                    fontSize: 'clamp(16px, 3vw, 18px)',
                                    fontWeight: 600,
                                    margin: '0 0 clamp(16px, 3vw, 20px) 0',
                                    color: '#111827',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    flexWrap: 'wrap'
                                }}>
                                    <span style={{ color: '#E31937', display: 'flex', alignItems: 'center', flexShrink: 0 }}>{Icons.vin}</span>
                                    VIN Breakdown
                                </h3>
                                
                                {report.vin && (
                                    <div style={{
                                        backgroundColor: '#ffffff',
                                        borderRadius: '8px',
                                        padding: 'clamp(12px, 2vw, 16px)',
                                        marginBottom: 'clamp(16px, 3vw, 20px)',
                                        border: '1px solid #e5e7eb',
                                        fontFamily: 'monospace',
                                        fontSize: 'clamp(14px, 3vw, 20px)',
                                        letterSpacing: 'clamp(2px, 0.5vw, 4px)',
                                        textAlign: 'center',
                                        fontWeight: 600,
                                        color: '#111827',
                                        overflowX: 'auto'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '2px' }}>
                                            {report.vin.split('').map((char, index) => (
                                                <span key={index} style={{
                                                    display: 'inline-block',
                                                    minWidth: 'clamp(18px, 3vw, 24px)',
                                                    textAlign: 'center',
                                                    borderBottom: '2px solid #E31937',
                                                    paddingBottom: '4px'
                                                }}>{char}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div style={{
                                    padding: '8px 0',
                                    color: '#6b7280',
                                    fontSize: '14px',
                                    fontStyle: 'italic'
                                }}>
                                    Full VIN breakdown available in Final Report
                                </div>
                            </div>
                        )}
                        {report.validation && (
                            <SampleReportSection title="Validation" data={report.validation} icon={Icons.validation} />
                        )}
                        {report.vehicleConfiguration && (
                            <SampleReportSection title="Vehicle Configuration" data={report.vehicleConfiguration} icon={Icons.vehicle} />
                        )}
                        {report.performanceSpecifications && (
                            <SampleReportSection title="Performance Specifications" data={report.performanceSpecifications} icon={Icons.performance} />
                        )}
                        {report.batteryInsights && (
                            <SampleReportSection title="Battery Insights" data={report.batteryInsights} icon={Icons.battery} />
                        )}
                        {report.batteryHealth && (
                            <SampleReportSection title="Battery Health" data={report.batteryHealth} icon={Icons.batteryHealth} />
                        )}
                        {report.connectivityInsights && (
                            <SampleReportSection title="Connectivity Insights" data={report.connectivityInsights} icon={Icons.connectivity} />
                        )}
                        {report.safetyFeatures && (
                            <SampleReportSection title="Safety Features" data={report.safetyFeatures} icon={Icons.safety} />
                        )}
                        {report.featurePackages && (
                            <SampleReportSection title="Feature Packages" data={report.featurePackages} icon={Icons.package} />
                        )}
                        {report.warrantyInformation && (
                            <SampleReportSection title="Warranty Information" data={report.warrantyInformation} icon={Icons.warranty} />
                        )}
                        {report.serviceAndMaintenance && (
                            <SampleReportSection title="Service & Maintenance" data={report.serviceAndMaintenance} icon={Icons.service} />
                        )}
                        {report.marketInformation && (
                            <SampleReportSection title="Market Information" data={report.marketInformation} icon={Icons.market} />
                        )}
                        {report.productionDetails && (
                            <SampleReportSection title="Production Details" data={report.productionDetails} icon={Icons.production} />
                        )}
                        {report.chargingCompatibility && (
                            <SampleReportSection title="Charging Compatibility" data={report.chargingCompatibility} icon={Icons.charging} />
                        )}
                        {report.softwareAndUpdates && (
                            <SampleReportSection title="Software & Updates" data={report.softwareAndUpdates} icon={Icons.software} />
                        )}
                        {report.internetInsights && (
                            <SampleReportSection title="Internet Insights" data={report.internetInsights} icon={Icons.internet} />
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (report && showFinalReport) {
        // Show loading while verifying payment
        if (paymentVerified === null) {
            return (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    flexDirection: 'column',
                    gap: '20px'
                }}>
                    <svg width="40" height="40" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ animation: 'spin 1s linear infinite' }}>
                        <circle cx="10" cy="10" r="7" stroke="#E31937" strokeWidth="2" strokeDasharray="22" strokeDashoffset="11" strokeLinecap="round" opacity="0.5"/>
                    </svg>
                    <p style={{ color: '#6b7280', fontSize: '16px' }}>
                        Verifying payment...
                    </p>
                </div>
            );
        }
        
        // Payment not verified, redirect back to sample report
        if (paymentVerified === false) {
            return (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    flexDirection: 'column',
                    gap: '20px'
                }}>
                    <p style={{ color: '#E31937', fontSize: '18px' }}>
                        Payment verification required to view Final Report
                    </p>
                    <button
                        onClick={() => {
                            setShowFinalReport(false);
                            setPaymentVerified(null);
                        }}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#E31937',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        Return to Sample Report
                    </button>
                </div>
            );
        }
    }

    if (report && showFinalReport) {
        return (
            <div style={{
                minHeight: '100vh',
                padding: 'clamp(20px, 5vw, 40px) clamp(16px, 4vw, 20px)',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                position: 'relative'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'clamp(16px, 3vw, 24px)'
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        marginBottom: '8px'
                    }}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            flex: 1
                        }}>
                            <h1 style={{
                                fontSize: 'clamp(24px, 5vw, 28px)',
                                fontWeight: 600,
                                margin: 0,
                                color: '#111827'
                            }}>Final Report</h1>
                            <p style={{
                                fontSize: 'clamp(14px, 3vw, 16px)',
                                color: '#6b7280',
                                margin: 0
                            }}>VIN: {report.vin}</p>
                        </div>
                        <div style={{ 
                            display: 'flex', 
                            flexDirection: 'row',
                            gap: '12px',
                            width: '100%'
                        }}>
                            <button
                                onClick={handlePrint}
                                style={{
                                    padding: 'clamp(10px, 2vw, 12px) clamp(16px, 4vw, 20px)',
                                    backgroundColor: '#6b7280',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: 'clamp(13px, 2.5vw, 14px)',
                                    fontWeight: 500,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    minHeight: '44px',
                                    flex: 1
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 2H12V4H4V2Z" fill="currentColor"/>
                                    <path d="M2 4H14C15.1046 4 16 4.89543 16 6V10C16 11.1046 15.1046 12 14 12H12V14H4V12H2C0.895431 12 0 11.1046 0 10V6C0 4.89543 0.895431 4 2 4Z" fill="currentColor"/>
                                    <path d="M4 8H12V10H4V8Z" fill="currentColor"/>
                                </svg>
                                Print
                            </button>
                            <button
                                onClick={handleNewReport}
                                style={{
                                    padding: 'clamp(10px, 2vw, 12px) clamp(16px, 4vw, 20px)',
                                    backgroundColor: '#E31937',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: 'clamp(13px, 2.5vw, 14px)',
                                    fontWeight: 500,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    minHeight: '44px',
                                    flex: 1
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 2V6M8 2L6 4M8 2L10 4M8 14V10M8 14L6 12M8 14L10 12M2 8H6M2 8L4 6M2 8L4 10M14 8H10M14 8L12 6M14 8L12 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Generate a new Report
                            </button>
                        </div>
                    </div>

                    <TableOfContents report={report} />

                    {report.analysis?.summary && (
                        <div style={{
                            backgroundColor: '#f5f5f5',
                            border: '1px solid #E31937',
                            borderRadius: '12px',
                            padding: 'clamp(16px, 3vw, 20px)',
                            marginBottom: '8px'
                        }}>
                            <h2 style={{
                                fontSize: 'clamp(18px, 4vw, 20px)',
                                fontWeight: 600,
                                margin: '0 0 clamp(10px, 2vw, 12px) 0',
                                color: '#171717',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                flexWrap: 'wrap'
                            }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="#171717"/>
                                </svg>
                                Summary
                            </h2>
                            <p style={{
                                fontSize: 'clamp(14px, 3vw, 16px)',
                                color: '#171717',
                                margin: 0,
                                lineHeight: '1.6',
                                wordBreak: 'break-word'
                            }}>{report.analysis.summary}</p>
                        </div>
                    )}

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'clamp(16px, 3vw, 20px)'
                    }}>
                        {report.vinBreakdown && (
                            <VinBreakdown vin={report.vin} data={report.vinBreakdown} />
                        )}
                        {report.validation && (
                            <ReportSection title="Validation" data={report.validation} icon={Icons.validation} />
                        )}
                        {report.vehicleConfiguration && (
                            <ReportSection title="Vehicle Configuration" data={report.vehicleConfiguration} icon={Icons.vehicle} />
                        )}
                        {report.performanceSpecifications && (
                            <ReportSection title="Performance Specifications" data={report.performanceSpecifications} icon={Icons.performance} />
                        )}
                        {report.batteryInsights && (
                            <ReportSection title="Battery Insights" data={report.batteryInsights} icon={Icons.battery} />
                        )}
                        {report.batteryHealth && (
                            <ReportSection title="Battery Health" data={report.batteryHealth} icon={Icons.batteryHealth} />
                        )}
                        {report.connectivityInsights && (
                            <ReportSection title="Connectivity Insights" data={report.connectivityInsights} icon={Icons.connectivity} />
                        )}
                        {report.safetyFeatures && (
                            <ReportSection title="Safety Features" data={report.safetyFeatures} icon={Icons.safety} />
                        )}
                        {report.featurePackages && (
                            <ReportSection title="Feature Packages" data={report.featurePackages} icon={Icons.package} />
                        )}
                        {report.warrantyInformation && (
                            <ReportSection title="Warranty Information" data={report.warrantyInformation} icon={Icons.warranty} />
                        )}
                        {report.serviceAndMaintenance && (
                            <ReportSection title="Service & Maintenance" data={report.serviceAndMaintenance} icon={Icons.service} />
                        )}
                        {report.marketInformation && (
                            <ReportSection title="Market Information" data={report.marketInformation} icon={Icons.market} />
                        )}
                        {report.productionDetails && (
                            <ReportSection title="Production Details" data={report.productionDetails} icon={Icons.production} />
                        )}
                        {report.chargingCompatibility && (
                            <ReportSection title="Charging Compatibility" data={report.chargingCompatibility} icon={Icons.charging} />
                        )}
                        {report.softwareAndUpdates && (
                            <ReportSection title="Software & Updates" data={report.softwareAndUpdates} icon={Icons.software} />
                        )}
                        {report.internetInsights && (
                            <ReportSection title="Internet Insights" data={report.internetInsights} icon={Icons.internet} />
                        )}
                    </div>

                    {report.analysis?.keyFindings && report.analysis.keyFindings.length > 0 && (
                        <div style={{
                            backgroundColor: '#f9fafb',
                            borderRadius: '12px',
                            padding: 'clamp(16px, 3vw, 20px)',
                            border: '1px solid #e5e7eb'
                        }}>
                            <h3 style={{
                                fontSize: 'clamp(16px, 3vw, 18px)',
                                fontWeight: 600,
                                margin: '0 0 clamp(12px, 2vw, 16px) 0',
                                color: '#111827',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                flexWrap: 'wrap'
                            }}>
                                <span style={{ color: '#E31937', display: 'flex', alignItems: 'center', flexShrink: 0 }}>{Icons.keyFindings}</span>
                                Key Findings
                            </h3>
                            <ul style={{
                                margin: 0,
                                paddingLeft: 'clamp(16px, 3vw, 20px)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px'
                            }}>
                                {report.analysis.keyFindings.map((finding, index) => (
                                    <li key={index} style={{
                                        color: '#374151',
                                        lineHeight: '1.6',
                                        fontSize: 'clamp(13px, 2.5vw, 14px)',
                                        wordBreak: 'break-word'
                                    }}>{finding}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {report.analysis?.recommendations && report.analysis.recommendations.length > 0 && (
                        <div style={{
                            backgroundColor: '#f5f5f5',
                            borderRadius: '12px',
                            padding: 'clamp(16px, 3vw, 20px)',
                            border: '1px solid #E31937'
                        }}>
                            <h3 style={{
                                fontSize: 'clamp(16px, 3vw, 18px)',
                                fontWeight: 600,
                                margin: '0 0 clamp(12px, 2vw, 16px) 0',
                                color: '#171717',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                flexWrap: 'wrap'
                            }}>
                                <span style={{ color: '#E31937', display: 'flex', alignItems: 'center', flexShrink: 0 }}>{Icons.recommendations}</span>
                                Recommendations
                            </h3>
                            <ul style={{
                                margin: 0,
                                paddingLeft: 'clamp(16px, 3vw, 20px)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px'
                            }}>
                                {report.analysis.recommendations.map((rec, index) => (
                                    <li key={index} style={{
                                        color: '#171717',
                                        lineHeight: '1.6',
                                        fontSize: 'clamp(13px, 2.5vw, 14px)',
                                        wordBreak: 'break-word'
                                    }}>{rec}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {report.analysis?.insights && report.analysis.insights.length > 0 && (
                        <div style={{
                            backgroundColor: '#f5f5f5',
                            borderRadius: '12px',
                            padding: 'clamp(16px, 3vw, 20px)',
                            border: '1px solid #E31937'
                        }}>
                            <h3 style={{
                                fontSize: 'clamp(16px, 3vw, 18px)',
                                fontWeight: 600,
                                margin: '0 0 clamp(12px, 2vw, 16px) 0',
                                color: '#171717',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                flexWrap: 'wrap'
                            }}>
                                <span style={{ color: '#E31937', display: 'flex', alignItems: 'center', flexShrink: 0 }}>{Icons.insights}</span>
                                Additional Insights
                            </h3>
                            <ul style={{
                                margin: 0,
                                paddingLeft: 'clamp(16px, 3vw, 20px)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px'
                            }}>
                                {report.analysis.insights.map((insight, index) => (
                                    <li key={index} style={{
                                        color: '#171717',
                                        lineHeight: '1.6',
                                        fontSize: 'clamp(13px, 2.5vw, 14px)',
                                        wordBreak: 'break-word'
                                    }}>{insight}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {report.analysis?.notableFeatures && report.analysis.notableFeatures.length > 0 && (
                        <div style={{
                            backgroundColor: '#f5f5f5',
                            borderRadius: '12px',
                            padding: 'clamp(16px, 3vw, 20px)',
                            border: '1px solid #E31937'
                        }}>
                            <h3 style={{
                                fontSize: 'clamp(16px, 3vw, 18px)',
                                fontWeight: 600,
                                margin: '0 0 clamp(12px, 2vw, 16px) 0',
                                color: '#171717',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                flexWrap: 'wrap'
                            }}>
                                <span style={{ color: '#E31937', display: 'flex', alignItems: 'center', flexShrink: 0 }}>{Icons.notableFeatures}</span>
                                Notable Features
                            </h3>
                            <ul style={{
                                margin: 0,
                                paddingLeft: 'clamp(16px, 3vw, 20px)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px'
                            }}>
                                {report.analysis.notableFeatures.map((feature, index) => (
                                    <li key={index} style={{
                                        color: '#171717',
                                        lineHeight: '1.6',
                                        fontSize: 'clamp(13px, 2.5vw, 14px)',
                                        wordBreak: 'break-word'
                                    }}>{feature}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {report.analysis?.considerations && report.analysis.considerations.length > 0 && (
                        <div style={{
                            backgroundColor: '#f5f5f5',
                            borderRadius: '12px',
                            padding: 'clamp(16px, 3vw, 20px)',
                            border: '1px solid #E31937'
                        }}>
                            <h3 style={{
                                fontSize: 'clamp(16px, 3vw, 18px)',
                                fontWeight: 600,
                                margin: '0 0 clamp(12px, 2vw, 16px) 0',
                                color: '#171717',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                flexWrap: 'wrap'
                            }}>
                                <span style={{ color: '#E31937', display: 'flex', alignItems: 'center', flexShrink: 0 }}>{Icons.considerations}</span>
                                Important Considerations
                            </h3>
                            <ul style={{
                                margin: 0,
                                paddingLeft: 'clamp(16px, 3vw, 20px)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px'
                            }}>
                                {report.analysis.considerations.map((consideration, index) => (
                                    <li key={index} style={{
                                        color: '#171717',
                                        lineHeight: '1.6',
                                        fontSize: 'clamp(13px, 2.5vw, 14px)',
                                        wordBreak: 'break-word'
                                    }}>{consideration}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div style={{
                        marginTop: 'clamp(24px, 4vw, 32px)',
                        paddingTop: 'clamp(20px, 3vw, 24px)',
                        borderTop: '1px solid #e5e7eb'
                    }}>
                        <p style={{
                            fontSize: 'clamp(11px, 2vw, 12px)',
                            color: '#6b7280',
                            margin: 0,
                            lineHeight: '1.6',
                            textAlign: 'center',
                            wordBreak: 'break-word'
                        }}>
                            This report is generated based on VIN decoding standards and may contain estimated or inferred information. 
                            Always verify critical information through official Tesla channels. Information accuracy is not guaranteed.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100vh',
            maxHeight: '100vh',
            overflow: 'hidden',
            flexDirection: 'column', 
            gap: '20px', 
            padding: '20px',
            position: 'relative'
        }}>
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 0,
                    opacity: loading ? 1 : 0,
                    transition: 'opacity 0.6s ease',
                    pointerEvents: 'none'
                }}
            >
                <video
                    ref={videoRef}
                    src="/tesla-zoomin.mp4"
                    muted
                    playsInline
                    loop
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }}
                />
            </div>
            <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: '8px',
                position: 'relative',
                zIndex: 1,
                width: '100%',
                textAlign: 'center'
            }}>
                <h1 style={{ 
                    fontWeight: 600, 
                    fontSize: 'clamp(28px, 8vw, 48px)', 
                    margin: 0, 
                    color: '#ffffff',
                    textAlign: 'inherit'
                }}>
                    <label htmlFor="vin-input" style={{ cursor: 'pointer', color: '#ffffff' }}>
                        TESLA VIN REPORT
                    </label>
                </h1>
                <p style={{ 
                    fontSize: '14px', 
                    color: '#ffffff', 
                    margin: 0,
                    textAlign: 'inherit'
                }}>
                    Enter your Tesla VIN to generate a detailed report
                </p>
            </div>
            <form onSubmit={handleSubmit} style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '12px', 
                alignItems: 'center', 
                width: '100%', 
                maxWidth: '400px',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'stretch', width: '100%' }}>
                    <input
                        id="vin-input"
                        type="text"
                        value={vin}
                        onChange={handleVinChange}
                        placeholder="Enter 17-character VIN"
                        maxLength={17}
                        disabled={loading}
                        style={{
                            padding: '12px 16px',
                            fontSize: '18px',
                                    border: `2px solid ${error ? '#E31937' : vin.length === 17 && !error ? '#E31937' : '#ccc'}`,
                            borderRadius: '8px',
                            flex: 1,
                            textAlign: 'center',
                            fontFamily: 'inherit',
                            letterSpacing: '1px',
                            boxSizing: 'border-box',
                            opacity: loading ? 0.6 : 1
                        }}
                    />
                    <button
                        type="submit"
                        disabled={vin.length !== 17 || error || !isTeslaVIN(vin) || loading}
                        style={{
                            padding: '12px 16px',
                            fontSize: '18px',
                            border: '2px solid transparent',
                            borderRadius: '8px',
                            backgroundColor: vin.length === 17 && !error && isTeslaVIN(vin) && !loading ? '#E31937' : '#9ca3af',
                            color: 'white',
                            cursor: vin.length === 17 && !error && isTeslaVIN(vin) && !loading ? 'pointer' : 'not-allowed',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background-color 0.2s',
                            boxSizing: 'border-box',
                            minWidth: '50px'
                        }}
                    >
                        {loading ? (
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ animation: 'spin 1s linear infinite' }}>
                                <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="2" strokeDasharray="22" strokeDashoffset="11" strokeLinecap="round" opacity="0.5"/>
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        )}
                    </button>
                </div>
                {apiError && (
                    <p style={{ fontSize: '14px', color: '#dc2626', margin: 0, textAlign: 'center' }}>
                        {apiError}
                    </p>
                )}
                <p style={{ 
                    fontSize: '12px', 
                    color: 'rgba(255, 255, 255, 0.7)', 
                    margin: 0, 
                    textAlign: 'center',
                    fontStyle: 'italic',
                    maxWidth: '400px',
                    lineHeight: '1.4'
                }}>
                    Reports can take up to 3 minutes as we analyze multiple sources
                </p>
            </form>
            <style dangerouslySetInnerHTML={{ __html: `
                .footer-mobile { padding: 0 16px 20px; }
                .footer-links { display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 8px 12px; }
                @media (max-width: 480px) {
                    .footer-links { flex-direction: column; gap: 6px; }
                    .footer-sep { display: none; }
                }
            `}} />
            <div className="footer-mobile" style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px'
            }}>
                <div className="footer-links" style={{ maxWidth: '100%' }}>
                    <span style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>
                        © 2026 TeslaVINReport
                    </span>
                    <span className="footer-sep" style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '12px' }}>•</span>
                    <a href="/Blog.txt" target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.8)'} onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.6)'}>Blog</a>
                    <span className="footer-sep" style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '12px' }}>•</span>
                    <a href="/PrivacyPolicy.txt" target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.8)'} onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.6)'}>Privacy</a>
                    <span className="footer-sep" style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '12px' }}>•</span>
                    <a href="/llms.txt" target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.8)'} onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.6)'}>For LLMs</a>
                    <span className="footer-sep" style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '12px' }}>•</span>
                    <a href="https://forms.gle/Mi6MqMfDqWFvbz4AA" target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.8)'} onMouseLeave={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.6)'}>Feature Request</a>
                </div>
                <a
                    href="https://www.repairwise.pro/blog/how-to-maximize-the-lifespan-of-your-tesla-model-3-tires"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.6)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                    <span>CC</span>
                    <span>Image via RepairWise</span>
                </a>
            </div>
        </div>
    );
}

export default function Page() {
    return (
        <Suspense fallback={
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh'
            }}>
                <p>Loading...</p>
            </div>
        }>
            <PageContent />
        </Suspense>
    );
}
