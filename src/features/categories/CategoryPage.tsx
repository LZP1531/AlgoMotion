import { ArrowRight, BookOpen } from "lucide-react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import { categories } from "../../data/categories";
import { problems } from "../../data/problems";
import type { Language } from "../../types/content";
import { getDifficultyLabel } from "../../utils/difficulty";

interface OutletContext {
  language: Language;
}

export function CategoryPage() {
  const { language } = useOutletContext<OutletContext>();
  const { categoryId = categories[0].id } = useParams();
  const category = categories.find((item) => item.id === categoryId) ?? categories[0];
  const categoryProblems = problems.filter((problem) => problem.categoryId === category.id);

  return (
    <section className="category-page">
      <div className="category-intro">
        <p>{language === "zh" ? category.descriptionZh : category.descriptionEn}</p>
        <span>
          {categoryProblems.length} {language === "zh" ? "道示例题" : "sample problems"}
        </span>
      </div>

      {categoryProblems.length > 0 ? (
        <div className="problem-grid">
          {categoryProblems.map((problem) => (
            <Link key={problem.id} className="problem-card" to={`/problem/${problem.slug}`}>
              <div className="problem-card-top">
                <span className={`difficulty ${problem.difficulty}`}>{getDifficultyLabel(problem.difficulty, language)}</span>
                <BookOpen size={18} />
              </div>
              <h2>{language === "zh" ? problem.titleZh : problem.titleEn}</h2>
              <p>
                #{problem.id} · {problem.tags.join(" / ")}
              </p>
              <span className="card-action">
                {language === "zh" ? "查看动态图解" : "Open visual guide"}
                <ArrowRight size={17} />
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <BookOpen size={38} />
          <h2>{language === "zh" ? "这个分类正在等待题目" : "This category is ready for problems"}</h2>
          <p>
            {language === "zh"
              ? "后续只需要在数据文件里补充题目元信息、Markdown 和动画 key。"
              : "Add problem metadata, Markdown, and an animation key in the data files."}
          </p>
        </div>
      )}
    </section>
  );
}
