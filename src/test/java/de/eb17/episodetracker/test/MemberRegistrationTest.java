package de.eb17.episodetracker.test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import java.util.Map;
import java.util.logging.Logger;

import javax.inject.Inject;
import javax.ws.rs.core.Response;

import org.jboss.arquillian.container.test.api.Deployment;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.arquillian.junit.InSequence;
import de.eb17.episodetracker.data.MemberRepository;
import de.eb17.episodetracker.rest.MemberService;
import de.eb17.episodetracker.service.MemberRegistration;
import org.jboss.shrinkwrap.api.Archive;
import org.jboss.shrinkwrap.api.ShrinkWrap;
import org.jboss.shrinkwrap.api.asset.EmptyAsset;
import org.jboss.shrinkwrap.api.spec.WebArchive;
import org.junit.Test;
import org.junit.runner.RunWith;

import de.eb17.episodetracker.model.Member;
import de.eb17.episodetracker.util.Resources;

/**
 * Uses Arquilian to test the JAX-RS processing class for member registration.
 * 
 */
@RunWith(Arquillian.class)
public class MemberRegistrationTest {
    @Deployment
    public static Archive<?> createTestArchive() {
        return ShrinkWrap
                .create(WebArchive.class, "test.war")
                .addClasses(Member.class, MemberService.class, MemberRepository.class, MemberRegistration.class,
                        Resources.class).addAsResource("META-INF/persistence.xml", "META-INF/persistence.xml")
                .addAsWebInfResource("arquillian-ds.xml").addAsWebInfResource(EmptyAsset.INSTANCE, "beans.xml");
    }

    @Inject
    MemberService memberRegistration;

    @Inject
    Logger log;

    @Test
    @InSequence(1)
    public void testRegister() throws Exception {
        Member member = createMemberInstance("Jack", "Doe", "jack@mailinator.com", "jack1234");
        Response response = memberRegistration.createMember(member);

        assertEquals("Unexpected response status", 200, response.getStatus());
        log.info(" New member was persisted and returned status " + response.getStatus());
    }

    @SuppressWarnings("unchecked")
    @Test
    @InSequence(2)
    public void testInvalidRegister() throws Exception {
        Member member = createMemberInstance("", "", "", "");
        Response response = memberRegistration.createMember(member);

        assertEquals("Unexpected response status", 400, response.getStatus());
        assertNotNull("response.getEntity() should not null", response.getEntity());
        assertEquals("Unexpected response.getEntity(). It contains " + response.getEntity(), 3,
                ((Map<String, String>) response.getEntity()).size());
        log.info("Invalid member register attempt failed with return code " + response.getStatus());
    }

    @SuppressWarnings("unchecked")
    @Test
    @InSequence(3)
    public void testDuplicateEmail() throws Exception {
        // Register an initial user
        Member member = createMemberInstance("Jane", "Doe", "jane@mailinator.com", "jane1234");
        memberRegistration.createMember(member);

        // Register a different user with the same email
        Member anotherMember = createMemberInstance("John", "Doe", "jane@mailinator.com", "john1234");
        Response response = memberRegistration.createMember(anotherMember);

        assertEquals("Unexpected response status", 409, response.getStatus());
        assertNotNull("response.getEntity() should not null", response.getEntity());
        assertEquals("Unexpected response.getEntity(). It contains" + response.getEntity(), 1,
                ((Map<String, String>) response.getEntity()).size());
        log.info("Duplicate member register attempt failed with return code " + response.getStatus());
    }

    private Member createMemberInstance(String forename, String surname, String email, String pw) {
        Member member = new Member();
        member.setEmail(email);
        member.setPassword(pw);
        member.setForename(forename);
        member.setSurname(surname);
        return member;
    }
}
