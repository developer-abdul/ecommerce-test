# E-commerce Back Office

## The purpose/use case of this back office is:
- Login to the back office with email and password
- See and navigate a product category tree
- See a list of products belonging to a specific category in pages of 5, 10, 20, 50 elements per page
- Sort product list by different fields (e.g., id, name) in ascending/descending order
- View the product information on a separate product details page
- Add/modify attributes of a product. Possible attribute types: "number", "text", "url", "tags", "boolean"
- See the last modified product in a custom widget on top of the page (custom here means that you have to implement a new component, not using the one that the component library of your choice provides)
- Logout from the back office

## Technology requirements
React and Typescript are mandatory requirements. Apart from this, you can use any libraries, frameworks, task runners, and build processors. Usage of AntDesign is a plus

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Ant Design, Tailwind CSS, NextAuth.js, Redux Toolkit
- **API**: JSON Server for API mocking

## Getting Started

1. **Clone the repository**
   ```bash
   git clone [your-repo-url]
   cd ecommerce-test
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start the development environment**
   ```bash
   # Start both the Next.js app and JSON Server
   pnpm run dev:all
   ```
