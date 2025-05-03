import { useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { motion } from 'framer-motion';
import styles from './InspirationDesign.module.css';

interface DesignIdea {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  materialTags: string[];
  colorPalette: string[];
}

const minimalistDesignIdeas: DesignIdea[] = [
  {
    id: 1,
    title: 'Скандинавская простота',
    description: 'Светлые деревянные поверхности сочетаются с белыми стенами и натуральными текстилями для создания уютного, но минималистичного пространства.',
    imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1000',
    materialTags: ['дерево', 'хлопок', 'лен', 'шерсть'],
    colorPalette: ['#FFFFFF', '#F5F5F5', '#E0E0E0', '#D2B48C', '#A0A0A0'],
  },
  {
    id: 2,
    title: 'Японский минимализм',
    description: 'Вдохновленный философией ваби-саби, этот стиль подчеркивает несовершенную красоту натуральных материалов и тихую элегантность.',
    imageUrl: 'https://images.unsplash.com/photo-1545083036-61d069b5a734?q=80&w=1000',
    materialTags: ['бамбук', 'рисовая бумага', 'дерево', 'камень'],
    colorPalette: ['#FFFFFF', '#F5F5F5', '#E9E9E9', '#D8D8D8', '#C0C0C0'],
  },
  {
    id: 3,
    title: 'Органический минимализм',
    description: 'Плавные линии и фактурные поверхности создают теплую атмосферу, сохраняя при этом чистоту и функциональность минимализма.',
    imageUrl: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=1000',
    materialTags: ['необработанное дерево', 'камень', 'глина', 'льняная ткань'],
    colorPalette: ['#F8F8F8', '#E8E6E1', '#D3CEBC', '#B6B6A8', '#857F72'],
  },
  {
    id: 4,
    title: 'Средиземноморская простота',
    description: 'Сочетание белоснежных стен, натурального дерева и добавления терракотовых акцентов создает воздушное, но уютное пространство.',
    imageUrl: 'https://images.unsplash.com/photo-1598928636135-d146006ff4be?q=80&w=1000',
    materialTags: ['штукатурка', 'терракота', 'оливковое дерево', 'известняк'],
    colorPalette: ['#FFFFFF', '#F5EFE5', '#E0C9A6', '#D2B491', '#A67F5D'],
  },
  {
    id: 5,
    title: 'Индустриальная чистота',
    description: 'Открытые пространства с бетонными поверхностями, дополненные теплыми деревянными элементами для баланса холодной текстуры.',
    imageUrl: 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?q=80&w=1000',
    materialTags: ['бетон', 'сталь', 'дуб', 'кожа'],
    colorPalette: ['#F5F5F5', '#E5E5E5', '#CCCCCC', '#B3B3B3', '#808080'],
  },
  {
    id: 6,
    title: 'Монохромная элегантность',
    description: 'Разные оттенки одного цвета создают глубину и интерес, сохраняя при этом спокойную атмосферу минимализма.',
    imageUrl: 'https://images.unsplash.com/photo-1606744888344-493238951221?q=80&w=1000',
    materialTags: ['мрамор', 'лён', 'войлок', 'дерево светлых тонов'],
    colorPalette: ['#FFFFFF', '#F8F8F8', '#F0F0F0', '#E0E0E0', '#D0D0D0'],
  },
  {
    id: 7,
    title: 'Природная палитра',
    description: 'Интерьер, выполненный в нейтральных тонах земли, песка и глины, с натуральными текстурами для создания гармоничного пространства.',
    imageUrl: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=1000',
    materialTags: ['джут', 'ротанг', 'тик', 'хлопок', 'глина'],
    colorPalette: ['#F2EFEA', '#E6DDC6', '#C9B79C', '#A98B73', '#7D6D61'],
  },
  {
    id: 8,
    title: 'Современный дзен',
    description: 'Спокойное пространство, вдохновленное японской философией, с идеальным балансом между пустотой и функциональностью.',
    imageUrl: 'https://images.unsplash.com/photo-1584536286788-78480e928faa?q=80&w=1000',
    materialTags: ['ясень', 'бамбук', 'хлопок', 'бумага васи'],
    colorPalette: ['#FFFFFF', '#F8F8F8', '#EFEFEF', '#D6D6D6', '#B1B1B1'],
  },
  {
    id: 9,
    title: 'Теплый минимализм',
    description: 'Уютное, современное пространство с натуральными материалами и светлыми древесными тонами для создания гостеприимной атмосферы.',
    imageUrl: 'https://images.unsplash.com/photo-1527694747872-cbc2e583c031?q=80&w=1000',
    materialTags: ['клён', 'шерсть', 'керамика', 'льняная ткань'],
    colorPalette: ['#F9F7F4', '#EFE9E4', '#D8CFC7', '#CEC2B3', '#A89784'],
  },
  {
    id: 10,
    title: 'Архитектурная простота',
    description: 'Чистые линии и безупречные пропорции создают структурированное, но открытое пространство, подчеркивающее естественное освещение.',
    imageUrl: 'https://images.unsplash.com/photo-1609347744403-c488095b8561?q=80&w=1000',
    materialTags: ['стекло', 'бетон', 'белый дуб', 'известняк'],
    colorPalette: ['#FFFFFF', '#FAFAFA', '#F5F5F5', '#EBEBEB', '#D9D9D9'],
  },
];

const InspirationDesign = () => {
  const [selectedIdea, setSelectedIdea] = useState<DesignIdea | null>(null);
  const [recommendedIdea] = useState<DesignIdea>(minimalistDesignIdeas[2]); // Organic minimalism as the recommended choice

  const handleIdeaClick = (idea: DesignIdea) => {
    setSelectedIdea(idea);
  };

  const closeModal = () => {
    setSelectedIdea(null);
  };

  return (
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Минималистичный дизайн интерьера</h1>
          <p className={styles.subtitle}>10 идей для современного, светлого пространства с натуральными материалами</p>
        </div>

        <section className={styles.recommendation}>
          <h2 className={styles.recommendationTitle}>Наш выбор</h2>
          <div className={styles.recommendedCard}>
            <div className={styles.recommendedImageContainer}>
              <img src={recommendedIdea.imageUrl} alt={recommendedIdea.title} className={styles.recommendedImage} />
            </div>
            <div className={styles.recommendedContent}>
              <h3 className={styles.recommendedIdeaTitle}>{recommendedIdea.title}</h3>
              <p className={styles.recommendedDescription}>{recommendedIdea.description}</p>
              
              <div className={styles.materialTags}>
                {recommendedIdea.materialTags.map((tag, index) => (
                  <span key={index} className={styles.materialTag}>{tag}</span>
                ))}
              </div>
              
              <div className={styles.colorPaletteContainer}>
                <h4 className={styles.colorPaletteTitle}>Цветовая палитра:</h4>
                <div className={styles.colorPalette}>
                  {recommendedIdea.colorPalette.map((color, index) => (
                    <div 
                      key={index}
                      className={styles.colorSwatch}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
              
              <p className={styles.analysisText}>
                <strong>Почему мы рекомендуем:</strong> Органический минимализм идеально сочетает в себе простоту минималистичного дизайна 
                с теплотой натуральных материалов. Плавные линии и природные текстуры создают спокойное, но 
                интересное пространство. Этот стиль позволяет выразить индивидуальность, сохраняя чистоту и функциональность.
              </p>
            </div>
          </div>
        </section>

        <h2 className={styles.galleryTitle}>Все идеи дизайна</h2>
        <div className={styles.ideasGrid}>
          {minimalistDesignIdeas.map((idea) => (
            <motion.div
              key={idea.id}
              className={styles.ideaCard}
              onClick={() => handleIdeaClick(idea)}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <div className={styles.ideaImageContainer}>
                <img src={idea.imageUrl} alt={idea.title} className={styles.ideaImage} />
              </div>
              <div className={styles.ideaContent}>
                <h3 className={styles.ideaTitle}>{idea.title}</h3>
                <div className={styles.colorSwatches}>
                  {idea.colorPalette.map((color, index) => (
                    <div 
                      key={index}
                      className={styles.smallColorSwatch}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {selectedIdea && (
          <div className={styles.modal} onClick={closeModal}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <button className={styles.closeButton} onClick={closeModal}>×</button>
              
              <div className={styles.modalImageContainer}>
                <img src={selectedIdea.imageUrl} alt={selectedIdea.title} className={styles.modalImage} />
              </div>
              
              <div className={styles.modalInfo}>
                <h2 className={styles.modalTitle}>{selectedIdea.title}</h2>
                <p className={styles.modalDescription}>{selectedIdea.description}</p>
                
                <div className={styles.modalMaterialTags}>
                  <h4>Материалы:</h4>
                  <div>
                    {selectedIdea.materialTags.map((tag, index) => (
                      <span key={index} className={styles.modalMaterialTag}>{tag}</span>
                    ))}
                  </div>
                </div>
                
                <div className={styles.modalColorPalette}>
                  <h4>Цветовая палитра:</h4>
                  <div className={styles.modalColors}>
                    {selectedIdea.colorPalette.map((color, index) => (
                      <div key={index} className={styles.modalColorDetail}>
                        <div 
                          className={styles.modalColorSwatch}
                          style={{ backgroundColor: color }}
                        />
                        <span>{color}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default InspirationDesign; 