import styles from "./AboutPage.module.css";
function AboutPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>About This Todo App</h1>

      <p className={styles.text}>
        This application is part of a guided project from the Code the Dream React course.
        Through this project, I’ve been able to practice important concepts like routing,
        authentication, and state management. Working on each section has helped me
        understand how a real React application is structured and how different pieces
        connect together.
      </p>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>App Features</h2>
        <ul className={styles.list}>
          <li>Create, complete, and delete tasks.</li>
          <li>Filter tasks by status using URL search parameters.</li>
          <li>Protected routes that require authentication.</li>
          <li>A profile page with task statistics.</li>
          <li>Navigation between pages without reloading the app.</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Technologies Used</h2>
        <ul className={styles.list}>
          <li><strong>React</strong> – for building the UI with components.</li>
          <li><strong>React Router</strong> – for navigation, routing, and protected pages.</li>
          <li><strong>Vite</strong> – for a fast and modern development environment.</li>
          <li><strong>Context API</strong> – for managing authentication and global state.</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Purpose of the Project</h2>
        <p className={styles.text}>
          The main goal of this project is to reinforce what I’m learning in class by applying
          concepts like state handling, routing, authentication, and code organization.
          It has been a helpful way to practice, make mistakes, fix them, and keep improving
          my understanding of React.
        </p>
      </section>
    </div>
  );
}

export default AboutPage;
