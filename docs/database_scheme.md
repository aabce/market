# Product
## Product Scheme

| Field | Data Type | Constraints | Description |
| --- | --- | --- | ---|
| upc | Number | unique | Universal Product Code |
| sku | String | unique | Stock Keeping Unit |
| title | String | | Title of a Product |
| subtitle | Hash Table of Strings | | Subtitle of a Product in 3 Languages |
| manufacture | String | | Name of a Product Manufacture |
| ratings | Hash Table of Numbers | | 5 Stars Rating of a Product |
| description | Hash Table of Strings | | Description of a Product in 3 Languages |
| type | String | | A grouping based on shared Characteristics (Class) |
| category | Array of Strings | | A group to which Items are assigned based on similarity or defined Criteria |
| quantity | Number | | Available quantity in the Stock |
| is_available | Boolean | | Is an Item available in the Stock |
| is_new | Boolean | | Is a Product new in the Store |
| shipping | Hash Table | | Physical Parameters of Products |
| photos | Array of Strings | | Photo Links |
| prices | Array of Hash Tables | | Prices with Different Currencies |
| colors | Array of Strings | enum | List of available Colors |
| created_at | Date | default: null | Date of Creation |
| updated_at | Date | default: null | Date of Update |
| attributes | Hash Table | | Custom Product Parameter in Key-Value Format |

### Subtitle Scheme

| Field | Data Type | Constraints | Description |
| --- | --- | ---| --- |
| en | String | | English Subtitle |
| ru | String | | Russian Subtitle |
| kz | String | | Kazakh Subtitle |

### Rating Scheme

| Field | Data Type | Constraints | Description |
| --- | --- | ---| --- |
| 5 | Number | default: 0 | 5 Star |
| 4 | Number | default: 0 | 4 Star |
| 3 | Number | default: 0 | 3 Star |
| 2 | Number | default: 0 | 2 Star |
| 1 | Number | default: 0 | 1 Star |

### Description Scheme

| Field | Data Type | Constraints | Description |
| --- | --- | ---| --- |
| en | String | | English Description |
| ru | String | | Russian Description |
| kz | String | | Kazakh Description |

### Shipping Scheme

| Field | Data Type | Constraints | Description |
| --- | --- | ---| --- |
| weight | Unit Parametric Form | | Weight of a Products |
| dimensions | Unit Parametric Form | | Dimensions of a Products (Width, Depth, Height) |

### Unit Parametric Form Scheme

| Field | Data Type | Constraints | Description |
| --- | --- | ---| --- |
| value | Number | | Numeric Value |
| unit | String | | Unit (e.g. g, kg, inch, mm) |

### Prices Scheme

| Field | Data Type | Constraints | Description |
| --- | --- | ---| --- |
| amount | Number | | Normal Product Price without Discount |
| currency | String | | Currency of Price |
| discount_amount | Number | | Product Price after Discount |
| discount_rate | Number | | Discount Rate in Percents |

### Attributes Scheme

| Field | Data Type | Constraints | Description |
| --- | --- | ---| --- |
| key | String | | Custom Product Parameter Name |
| value | String | | Custom Product Parameter Value |
