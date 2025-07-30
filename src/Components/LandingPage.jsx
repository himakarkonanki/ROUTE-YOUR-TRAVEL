import React, { useState } from 'react'
import '../App.css'
import RightPanel from './RightPanel'
import LeftPanel from './LeftPanel'

function LandingPage() {
  const [pages, setPages] = useState([
    { 
      id: 1, 
      type: 'cover', 
      title: 'Cover Page',
      destinationName: '',
      adults: 0,
      children: 0,
      tripDuration: '',
      backgroundImage: null
    },
    { 
      id: 2, 
      type: 'thankyou', 
      title: 'Thank You Page',
      thankYouTitle: '',      // Add these fields
      thankYouMessage: '',    // Add these fields
      contactDetails: ''      // Add these fields
    }
  ]);

  const addPage = (pageType) => {
    let newPage;
    
    if (pageType === 'day') {
      const dayPageCount = pages.filter(p => p.type === 'day').length;
      newPage = {
        id: Date.now(),
        type: 'day',
        title: `Day Page ${dayPageCount + 1}`,
        destination: '',
        arrivalDetails: '',
        transferDetails: '',
        dropDetails: '',
        activityDetails: ['', '', ''],
        uploadedImage: null,
        mealSelections: { breakfast: false, lunch: false, dinner: false },
        icons: { arrival: 'PlaneLanding', transfer: 'CarFront', drop: 'CarFront', activity: 'Landmark' },
        sectionHeadings: { arrival: 'Arrival', transfer: 'Transfer', activity: 'Activities', drop: 'Drop' },
        dynamicSections: []
      };
    } else if (pageType === 'policy') {
      const policyPageCount = pages.filter(p => p.type === 'policy').length;
      newPage = {
        id: Date.now(),
        type: 'policy',
        title: `Policy Page ${policyPageCount + 1}`,
        detailFields: [{ id: 1, type: 'details', hasContent: false, data: {} }],
        titleContent: ''
      };
    }

    if (newPage) {
      // Insert new page before thank you page
      const coverPages = pages.filter(p => p.type === 'cover');
      const dayPages = pages.filter(p => p.type === 'day');
      const policyPages = pages.filter(p => p.type === 'policy');
      const thankYouPages = pages.filter(p => p.type === 'thankyou');
      
      if (pageType === 'day') {
        setPages([...coverPages, ...dayPages, newPage, ...policyPages, ...thankYouPages]);
      } else if (pageType === 'policy') {
        setPages([...coverPages, ...dayPages, ...policyPages, newPage, ...thankYouPages]);
      }
    }
  };

  const duplicatePage = (pageId) => {
    const pageToGDuplicate = pages.find(p => p.id === pageId);
    if (pageToGDuplicate && (pageToGDuplicate.type === 'day' || pageToGDuplicate.type === 'policy')) {
      const duplicatedPage = {
        ...pageToGDuplicate,
        id: Date.now(),
        title: `${pageToGDuplicate.title} Copy`
      };

      // Insert the duplicated page right after the original
      const pageIndex = pages.findIndex(p => p.id === pageId);
      const newPages = [...pages];
      newPages.splice(pageIndex + 1, 0, duplicatedPage);
      setPages(newPages);
    }
  };

  const deletePage = (pageId) => {
    const pageToDelete = pages.find(p => p.id === pageId);
    // Only allow deletion of day and policy pages
    if (pageToDelete && (pageToDelete.type === 'day' || pageToDelete.type === 'policy')) {
      setPages(pages.filter(p => p.id !== pageId));
    }
  };

  // Handler to update page data (for real-time preview synchronization)
  const handlePageDataUpdate = (pageId, updatedData) => {
    setPages(prevPages => 
      prevPages.map(page => 
        page.id === pageId 
          ? { ...page, ...updatedData }
          : page
      )
    );
  };

  return (
    <div style={{
      display: "flex",
      width: "100vw",
      height: "100vh",
      overflow: "hidden",
      background: '#E7E9F5',
    }}>
      <LeftPanel 
        pages={pages} 
        onAddPage={addPage}
        onDuplicatePage={duplicatePage}
        onDeletePage={deletePage}
      />
      <div style={{ marginLeft: '320px', flex: 1 }}>
        <RightPanel 
          pages={pages} 
          onPageDataUpdate={handlePageDataUpdate}
        />
      </div>
    </div>
  );
}

export default LandingPage;
