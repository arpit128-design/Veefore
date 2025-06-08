// Trigger enhanced Instagram reach data sync with new methodology
import fetch from 'node-fetch';

async function triggerEnhancedReachSync() {
  console.log('[ENHANCED REACH] Triggering Instagram reach data sync with new methodology...');
  
  try {
    // Get user authentication
    const userResponse = await fetch('http://localhost:5000/api/user', {
      headers: {
        'Authorization': `Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImY4M2YzMmEzNGUwNDgzNTc3NjAyNGE1ZTg2MWI2NzI3NmFhNzA1YTQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdmVlZm9yZS1kZXYtZmlyZWJhc2UiLCJhdWQiOiJ2ZWVmb3JlLWRldi1maXJlYmFzZSIsImF1dGhfdGltZSI6MTczMzY2NTkzMCwidXNlcl9pZCI6IlhHME9ZeTJSa21ZTWhnUnpUNGNWamI0SDByWTIiLCJzdWIiOiJYRzBPWXkyUmttWU1oZ1J6VDRjVmpiNEgwclkyIiwiaWF0IjoxNzMzNjY1OTMwLCJleHAiOjE3MzM2Njk1MzAsImVtYWlsIjoiY2hvdWRoYXJ5YXJwaXQ5NzdAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMDk5MTQ4MzA5MzMyNjUzNzgwNzgiXSwiZW1haWwiOlsiY2hvdWRoYXJ5YXJwaXQ5NzdAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.gILJ6yRk8f6R6YOqW4oPYJfZcL7BFpWbTsaGhfcmfm8Qq8LvFj1BLPQV5nqhHXq2N3HHYu3sF7lh6LPh_Gp5qN6v8LPh_Gp5qN6v8LPh_Gp5qN6v8LPh_Gp5qN6v8LPh_Gp5qN6v8LPh_Gp5qN6v8`
      }
    });
    
    if (!userResponse.ok) {
      console.log('[ENHANCED REACH] User authentication failed');
      return;
    }
    
    // Trigger dashboard analytics refresh which includes Instagram sync
    const analyticsResponse = await fetch('http://localhost:5000/api/dashboard/analytics?workspaceId=68449f3852d33d75b31ce737', {
      headers: {
        'Authorization': `Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImY4M2YzMmEzNGUwNDgzNTc3NjAyNGE1ZTg2MWI2NzI3NmFhNzA1YTQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vdmVlZm9yZS1kZXYtZmlyZWJhc2UiLCJhdWQiOiJ2ZWVmb3JlLWRldi1maXJlYmFzZSIsImF1dGhfdGltZSI6MTczMzY2NTkzMCwidXNlcl9pZCI6IlhHME9ZeTJSa21ZTWhnUnpUNGNWamI0SDByWTIiLCJzdWIiOiJYRzBPWXkyUmttWU1oZ1J6VDRjVmpiNEgwclkyIiwiaWF0IjoxNzMzNjY1OTMwLCJleHAiOjE3MzM2Njk1MzAsImVtYWlsIjoiY2hvdWRoYXJ5YXJwaXQ5NzdAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMDk5MTQ4MzA5MzMyNjUzNzgwNzgiXSwiZW1haWwiOlsiY2hvdWRoYXJ5YXJwaXQ5NzdAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.gILJ6yRk8f6R6YOqW4oPYJfZcL7BFpWbTsaGhfcmfm8Qq8LvFj1BLPQV5nqhHXq2N3HHYu3sF7lh6LPh_Gp5qN6v8LPh_Gp5qN6v8LPh_Gp5qN6v8LPh_Gp5qN6v8LPh_Gp5qN6v8LPh_Gp5qN6v8`
      }
    });
    
    if (analyticsResponse.ok) {
      const analyticsData = await analyticsResponse.json();
      console.log('[ENHANCED REACH] Analytics data after sync:', analyticsData);
    } else {
      console.log('[ENHANCED REACH] Analytics refresh failed:', analyticsResponse.status);
    }
    
    console.log('[ENHANCED REACH] Enhanced reach sync completed');
  } catch (error) {
    console.error('[ENHANCED REACH] Error:', error);
  }
}

triggerEnhancedReachSync();