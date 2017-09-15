package hr.addiko.riznica.core.command



import grails.validation.Validateable
import hr.addiko.riznica.User
import hr.addiko.riznica.category.Category

class PostCommand implements Validateable {

    Long id
    String postTitle
    String postContent

    User user
    Category postCategory



    static constraints = {
        id nullable: true
        postTitle nullable: true
        postCategory nullable: true
        user nullable: true
    }
}