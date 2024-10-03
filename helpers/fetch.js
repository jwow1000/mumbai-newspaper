export function fetchMojes() {


  async function fetchDocs() {
    const response = await fetch("https://pad.ma/api/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            action: 'findDocuments',
            data: {
                query: {
                    conditions: [
                        { 
                        key: 'source', 
                        operator: '==', 
                        value: 'Mojes'
                        }
                    ]
                },
                keys: [
                        'id', 
                        'title', 
                        'description', 
                        'project', 
                        'source', 
                        'content', 
                        'translation',
                        'date'
                      ],
                sort: [{operator: "+", key: 'title'}],
                range: [0, 10]
            }
        })
    });
    const result = await response.json();
    return result.data.items;
  }
  return fetchDocs();
}