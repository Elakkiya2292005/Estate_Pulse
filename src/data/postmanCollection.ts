/**
 * Complete Postman Collection for EstatePulse Real Estate Management API
 * Ready for export and testing
 */
export const postmanCollectionData = {
  info: {
    _postman_id: "8253c767-7f1d-42a4-8f04-estatepulse-2026",
    name: "EstatePulse MERN API Collection",
    description: "Complete REST API endpoints for Real Estate Management System (Project 12) featuring Auth, Properties, Enquiries, Visits, Deals, and Analytics.",
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  item: [
    {
      name: "Authentication",
      item: [
        {
          name: "Register User",
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                name: "Jordan Vance",
                email: "jordan@example.com",
                password: "customer123",
                role: "customer",
                phone: "+1 555-0199"
              }, null, 2)
            },
            url: { raw: "{{baseUrl}}/api/auth/register", host: ["{{baseUrl}}"], path: ["api", "auth", "register"] }
          }
        },
        {
          name: "Login User",
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                email: "admin@estatepulse.com",
                password: "admin123"
              }, null, 2)
            },
            url: { raw: "{{baseUrl}}/api/auth/login", host: ["{{baseUrl}}"], path: ["api", "auth", "login"] }
          }
        },
        {
          name: "Get Current User (Me)",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
            url: { raw: "{{baseUrl}}/api/auth/me", host: ["{{baseUrl}}"], path: ["api", "auth", "me"] }
          }
        },
        {
          name: "Get Demo Credentials",
          request: {
            method: "GET",
            url: { raw: "{{baseUrl}}/api/auth/demo-users", host: ["{{baseUrl}}"], path: ["api", "auth", "demo-users"] }
          }
        }
      ]
    },
    {
      name: "Properties",
      item: [
        {
          name: "Get Properties (Filter, Search, Paginate)",
          request: {
            method: "GET",
            url: {
              raw: "{{baseUrl}}/api/properties?search=Villa&propertyType=villa&minPrice=1000000&page=1&limit=9",
              host: ["{{baseUrl}}"],
              path: ["api", "properties"],
              query: [
                { key: "search", value: "Villa" },
                { key: "propertyType", value: "villa" },
                { key: "minPrice", value: "1000000" },
                { key: "page", value: "1" },
                { key: "limit", value: "9" }
              ]
            }
          }
        },
        {
          name: "Get Property by ID",
          request: {
            method: "GET",
            url: { raw: "{{baseUrl}}/api/properties/prop-101", host: ["{{baseUrl}}"], path: ["api", "properties", "prop-101"] }
          }
        },
        {
          name: "Create Property (Admin/Agent)",
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "Authorization", value: "Bearer {{token}}" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                title: "Bel-Air Horizon Glass Villa",
                description: "Panoramic city-to-ocean views, private motor court, zero-edge pool.",
                price: 3250000,
                propertyType: "villa",
                status: "available",
                location: { address: "1480 Bellagio Road", city: "Los Angeles", state: "California", pincode: "90077" },
                features: { bedrooms: 5, bathrooms: 6, areaSqFt: 6200, furnished: "furnished", parking: true, amenities: ["Pool", "Cinema", "Gym"] }
              }, null, 2)
            },
            url: { raw: "{{baseUrl}}/api/properties", host: ["{{baseUrl}}"], path: ["api", "properties"] }
          }
        },
        {
          name: "Update Property (Admin/Agent)",
          request: {
            method: "PUT",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "Authorization", value: "Bearer {{token}}" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({ price: 3100000, status: "under_offer" }, null, 2)
            },
            url: { raw: "{{baseUrl}}/api/properties/prop-101", host: ["{{baseUrl}}"], path: ["api", "properties", "prop-101"] }
          }
        },
        {
          name: "Delete Property (Admin)",
          request: {
            method: "DELETE",
            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
            url: { raw: "{{baseUrl}}/api/properties/prop-105", host: ["{{baseUrl}}"], path: ["api", "properties", "prop-105"] }
          }
        }
      ]
    },
    {
      name: "Enquiries",
      item: [
        {
          name: "Submit Property Enquiry",
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                propertyId: "prop-101",
                customerName: "Elena Rostova",
                customerEmail: "elena.buyer@gmail.com",
                customerPhone: "+1 555-345-6789",
                message: "Interested in setting up private walkthrough."
              }, null, 2)
            },
            url: { raw: "{{baseUrl}}/api/enquiries", host: ["{{baseUrl}}"], path: ["api", "enquiries"] }
          }
        },
        {
          name: "Get Enquiries (Role Scoped)",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
            url: { raw: "{{baseUrl}}/api/enquiries", host: ["{{baseUrl}}"], path: ["api", "enquiries"] }
          }
        },
        {
          name: "Update Enquiry Status",
          request: {
            method: "PUT",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "Authorization", value: "Bearer {{token}}" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({ status: "contacted" }, null, 2)
            },
            url: { raw: "{{baseUrl}}/api/enquiries/enq-301/status", host: ["{{baseUrl}}"], path: ["api", "enquiries", "enq-301", "status"] }
          }
        }
      ]
    },
    {
      name: "Visits",
      item: [
        {
          name: "Schedule Walkthrough Visit",
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "Authorization", value: "Bearer {{token}}" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                propertyId: "prop-101",
                visitDate: "2026-03-10",
                visitTimeSlot: "15:00 - 16:00",
                notes: "Interested in outdoor amenities and sunset view."
              }, null, 2)
            },
            url: { raw: "{{baseUrl}}/api/visits", host: ["{{baseUrl}}"], path: ["api", "visits"] }
          }
        },
        {
          name: "Get Scheduled Visits",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
            url: { raw: "{{baseUrl}}/api/visits", host: ["{{baseUrl}}"], path: ["api", "visits"] }
          }
        },
        {
          name: "Update Visit Status / Feedback",
          request: {
            method: "PUT",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "Authorization", value: "Bearer {{token}}" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                status: "completed",
                feedback: "Client verified square footage and submitted offer."
              }, null, 2)
            },
            url: { raw: "{{baseUrl}}/api/visits/vis-401", host: ["{{baseUrl}}"], path: ["api", "visits", "vis-401"] }
          }
        }
      ]
    },
    {
      name: "Deals & Pipeline",
      item: [
        {
          name: "Create Deal",
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "Authorization", value: "Bearer {{token}}" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({
                propertyId: "prop-101",
                customerId: "usr-cust-1",
                agreedPrice: 2450000,
                dealType: "sale",
                stage: "offer_made",
                closingDate: "2026-04-30",
                paymentTerms: "10% escrow earnest deposit, 90% loan transfer."
              }, null, 2)
            },
            url: { raw: "{{baseUrl}}/api/deals", host: ["{{baseUrl}}"], path: ["api", "deals"] }
          }
        },
        {
          name: "Get Deals",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
            url: { raw: "{{baseUrl}}/api/deals", host: ["{{baseUrl}}"], path: ["api", "deals"] }
          }
        },
        {
          name: "Update Deal Stage",
          request: {
            method: "PUT",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "Authorization", value: "Bearer {{token}}" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({ stage: "under_contract" }, null, 2)
            },
            url: { raw: "{{baseUrl}}/api/deals/deal-501", host: ["{{baseUrl}}"], path: ["api", "deals", "deal-501"] }
          }
        }
      ]
    },
    {
      name: "Reports & Analytics",
      item: [
        {
          name: "Get Summary Dashboard KPIs",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
            url: { raw: "{{baseUrl}}/api/reports/dashboard", host: ["{{baseUrl}}"], path: ["api", "reports", "dashboard"] }
          }
        }
      ]
    }
  ]
};
