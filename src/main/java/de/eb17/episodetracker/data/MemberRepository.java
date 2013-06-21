package de.eb17.episodetracker.data;

import java.util.ArrayList;
import java.util.List;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import de.eb17.episodetracker.model.FollowedMember;
import de.eb17.episodetracker.model.Member;

@ApplicationScoped
public class MemberRepository {

    @Inject
    private EntityManager em;

    public Member findById(Long id) {
        return em.find(Member.class, id);
    }
    
    public Member update(Member member) {
    	return em.merge(member);
    }

    public Member findByEmail(String email) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Member> criteria = cb.createQuery(Member.class);
        Root<Member> member = criteria.from(Member.class);
        criteria.select(member).where(cb.equal(member.get("email"), email));
        return em.createQuery(criteria).getSingleResult();
    }

    public List<Member> findAllOrderedBySurname() {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Member> criteria = cb.createQuery(Member.class);
        Root<Member> member = criteria.from(Member.class);
        criteria.select(member).orderBy(cb.asc(member.get("surname")));
        return em.createQuery(criteria).getResultList();
    }

	public void addFollow(FollowedMember fm) {
		em.persist(fm);
	}
	

    public List<Member> findFollowedMembers(Long id) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<FollowedMember> criteria = cb.createQuery(FollowedMember.class);
        Root<FollowedMember> fm = criteria.from(FollowedMember.class);
        criteria.select(fm).where(cb.equal(fm.get("member"), id));
        List<FollowedMember> followedMembers = em.createQuery(criteria).getResultList();
        
        List<Member> members = new ArrayList<>();
        for (FollowedMember followedMember : followedMembers) {
			members.add(findById(followedMember.getFollow()));
		}
        
        return members;
    }
}
