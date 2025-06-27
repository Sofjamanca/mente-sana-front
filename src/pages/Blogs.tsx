import ArticleCard from "../components/ArticleCard";
import "../styles/Blogs.css"
import type { Article }  from "../components/ArticleCard";


const articles = [
    {
        id: 1,
        title: "Mindfulness: Cómo empezar en 5 minutos al día",
        description: "Aprendé técnicas simples de atención plena para reducir el estrés y mejorar tu concentración diaria.",
        category: "Mindfulness",
        author: "Dra. Laura Pérez",
        isLiked: false,
        image: "https://images.unsplash.com/photo-1551524164-687a55dd1126?fit=crop&w=600&h=400"
    },
    {
        id: 2,
        title: "Ansiedad: Cómo reconocerla y gestionarla",
        description: "Conocé los síntomas más comunes de la ansiedad y estrategias efectivas para afrontarla día a día.",
        category: "Ansiedad",
        author: "Lic. Mateo Gómez",
        isLiked: false,
        image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?fit=crop&w=600&h=400"
    },
    {
        id: 3,
        title: "Dormir mejor: Hábitos saludables para un descanso reparador",
        description: "El sueño es clave para la salud mental. Estos consejos te ayudarán a mejorar tu higiene del sueño.",
        category: "Sueño",
        author: "Psic. Valentina Ruiz",
        isLiked: false,
        image: "https://www.bupasalud.com/sites/default/files/styles/640_x_400/public/articulos/2023-03/fotos/woman-sleeping.jpg?itok=yXLD8bhX"
    },
    {
        id: 4,
        title: "Redes de apoyo emocional: ¿por qué son tan importantes?",
        description: "Tener personas con quien hablar es vital para tu bienestar. Te contamos cómo construir una red saludable.",
        category: "Relaciones",
        author: "Dr. Javier Castillo",
        isLiked: false,
        image: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?fit=crop&w=600&h=400"
    },
    {
        id: 5,
        title: "Autoestima: Cómo fortalecerla en tu vida cotidiana",
        description: "Descubrí herramientas prácticas para mejorar tu autoestima y sentirte mejor con vos mismo.",
        category: "Autoestima",
        author: "Psic. Camila Torres",
        isLiked: false,
        image: "https://upbility.es/cdn/shop/articles/blog_banners_3_58.png?v=1720608731&width=1600"
    }
];

const Page = () => {
    const handleLike = (id: number, liked: boolean) => {
        console.log("Artículo like toggled:", id, liked);
    };

    const handleShare = (article: Article) => {
        console.log("Compartir artículo:", article);
    };

    const handleClick = (article: Article) => {
        console.log("Click en tarjeta:", article);
    };

    return (
        <div className="blog-grid">
            {articles.map(article => (
                <ArticleCard
                    key={article.id}
                    article={article}
                    onLike={handleLike}
                    onShare={handleShare}
                    onClick={handleClick}
                />
            ))}
        </div>
    );
};


export default Page;
