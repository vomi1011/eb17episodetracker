package de.eb17.episodetracker.data;

import java.util.List;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import de.eb17.episodetracker.model.Serie;

@ApplicationScoped
public class SerieRepository {

    @Inject
    private EntityManager em;

    public void store(Serie serie) throws Exception {
        em.persist(serie);
    }
    
    public Serie findById(Long id) {
        return em.find(Serie.class, id);
    }

    public Serie findByUrl(String url) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        
        CriteriaQuery<Serie> criteria = cb.createQuery(Serie.class);
        Root<Serie> serie = criteria.from(Serie.class);
        criteria.select(serie).where(cb.equal(serie.get("url"), url));
        return em.createQuery(criteria).getSingleResult();
    }

    public List<Serie> findAllOrderedByTitle() {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Serie> criteria = cb.createQuery(Serie.class);
        Root<Serie> serie = criteria.from(Serie.class);
        criteria.select(serie).orderBy(cb.asc(serie.get("title")));
        return em.createQuery(criteria).getResultList();
    }
}
