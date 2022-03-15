from multiprocessing import Event
from sqlalchemy import (
    Table,
    Column,
    Integer,
    String,
    Date,
    ForeignKey,
    PrimaryKeyConstraint,
)
from sqlalchemy.orm import declarative_base, relationship

# create a base class for models to inherit
Base = declarative_base()


class Disease(Base):
    __tablename__ = "Diseases"
    id = Column(
        "id", Integer, nullable=False, unique=True, autoincrement=True, primary_key=True
    )
    name = Column("name", String, nullable=False, unique=True)

    reportdisease = relationship(
        "ReportDisease", back_populates="disease", uselist=False
    )

    def __repr__(self):
        return f"<Disease(id={self.id}, name='{self.name}')>"


class Syndrome(Base):
    __tablename__ = "Syndromes"
    id = Column(
        "id", Integer, nullable=False, unique=True, autoincrement=True, primary_key=True
    )
    name = Column("name", String, nullable=False)

    reportsyndrome = relationship(
        "ReportSyndrome", back_populates="syndrome", uselist=False
    )

    def __repr__(self):
        return f"<Syndrome(id={self.id}, name='{self.name}')>"


class ReportDisease(Base):
    __tablename__ = "ReportDiseases"
    id = Column(
        "id", Integer, nullable=False, unique=True, autoincrement=True, primary_key=True
    )
    disease_id = Column(
        "disease_id", Integer, ForeignKey("Diseases.id"), nullable=False
    )
    report_id = Column("report_id", Integer, ForeignKey("Reports.id"), nullable=False)

    disease = relationship("Disease", back_populates="reportdisease", uselist=False)
    report = relationship("Report", back_populates="reportdiseases", uselist=False)


class ReportSyndrome(Base):
    __tablename__ = "ReportSyndromes"
    id = Column(
        "id", Integer, nullable=False, unique=True, autoincrement=True, primary_key=True
    )
    syndrome_id = Column("syndrome_id", ForeignKey("Syndromes.id"), nullable=False)
    report_id = Column("report_id", ForeignKey("Reports.id"), nullable=False)

    syndrome = relationship("Syndrome", back_populates="reportsyndrome", uselist=False)
    report = relationship("Report", back_populates="reportsyndromes", uselist=False)


class EventDate(Base):
    __tablename__ = "EventDates"
    id = Column(
        "id", Integer, nullable=False, unique=True, autoincrement=True, primary_key=True
    )
    daydate = Column("daydate", Date, nullable=False, unique=True)
    hour = Column("hour", Integer, nullable=True)
    minute = Column("minute", Integer, nullable=True)

    # from relationships
    article = relationship("Article", back_populates="eventdate")
    report_start = relationship(
        "Report",
        back_populates="start_eventdate",
        foreign_keys="Report.start_eventdate_id",
    )
    report_finish = relationship(
        "Report",
        back_populates="finish_eventdate",
        foreign_keys="Report.finish_eventdate_id",
    )

    def __repr__(self):
        return f"<EventDate(id={self.id}, daydate={self.daydate}, hour={self.hour}, minute={self.minute})>"


class Article(Base):
    __tablename__ = "Articles"
    id = Column(
        "id", Integer, nullable=False, unique=True, autoincrement=True, primary_key=True
    )
    url = Column("url", String, nullable=False)
    headline = Column("headline", String, nullable=False)
    eventdate_id = Column("eventdate_id", ForeignKey("EventDates.id"), nullable=False)

    # to
    eventdate = relationship("EventDate", back_populates="article", uselist=False)

    # from
    report = relationship("Report", back_populates="article")

    def __init__(self, url, headline, eventdate=None, eventdate_id=None):
        self.url = url
        self.headline = headline

        if eventdate == None and eventdate_id == None:
            raise ValueError("Either 'eventdate' or 'eventdate_id' must have a value.")
        elif eventdate != None:
            self.eventdate = eventdate  # this will automatically set the id on commit
        elif eventdate_id != None:
            self.eventdate_id = eventdate_id
            self.eventdate = EventDate(
                id=eventdate_id
            )  # get the event date with the id

    def __repr__(self):
        return f"<Article(id={self.id}, url='{self.url}', headline='{self.headline}', eventdate_id={self.eventdate_id})>"


class Report(Base):
    __tablename__ = "Reports"
    id = Column(
        "id", Integer, nullable=False, unique=True, autoincrement=True, primary_key=True
    )
    article_id = Column("article_id", ForeignKey("Articles.id"), nullable=False)
    start_eventdate_id = Column(
        "start_eventdate_id", ForeignKey("EventDates.id"), nullable=False
    )
    finish_eventdate_id = Column(
        "finish_eventdate_id", ForeignKey("EventDates.id"), nullable=True
    )

    # to
    article = relationship("Article", back_populates="report", uselist=False)
    start_eventdate = relationship(
        "EventDate",
        back_populates="report_start",
        uselist=False,
        foreign_keys="Report.start_eventdate_id",
    )
    finish_eventdate = relationship(
        "EventDate",
        back_populates="report_finish",
        uselist=False,
        foreign_keys="Report.finish_eventdate_id",
    )
    reportlocations = relationship("ReportLocation", back_populates="report")

    reportdiseases = relationship("ReportDisease", back_populates="report")
    reportsyndromes = relationship("ReportSyndrome", back_populates="report")

    # both
    # diseases = relationship('Disease', secondary=ReportDisease, back_populates='reports')
    # syndromes = relationship('Syndrome', secondary=ReportSyndrome, back_populates='reports')

    def __init__(
        self,
        __id=-1,
        article=None,
        article_id=None,
        start_eventdate=None,
        finish_eventdate=None,
        reportlocations=None,
        diseases=[],
        syndromes=[],
    ):
        """_summary_

        Args:
            article (Article, optional): NOT optional if 'article_id' isn't provided. article is the Article object which this Report.article_id refers to. Defaults to None.
            article_id (int, optional):  NOT optional if 'article' isn't provided. article_id is the id of the Article this Report belongs to. Defaults to None.
            start_eventdate (EventDate): The time this report started.
            finish_eventdate (EventDate): The time this report finished.
            reportlocations (List[ReportLocation]): List of all report locations.
            diseases (List[Disease], optional): List of Disease objects. Defaults to empty list.
            syndromes (List[Syndrome], optional): List of Syndrome objects. Defaults to empty list.
        """

        # set id if provided
        # this is only for utils ViewReports manual returning of Report object
        if __id != -1:
            self.id = __id

        # ensure either article or article_id params were provided
        if article == None and article_id == None:
            raise ValueError("Either 'article' or 'article_id' must have a value.")
        elif article != None:
            self.article = article  # this will automatically set the id on commit
        elif article_id != None:
            self.article_id = article_id
            self.article = Article(id=article_id)  # get the event date with the id

        # check all other values were provided
        if start_eventdate == None:
            raise ValueError("Parameter 'start_eventdate' must have a value.")
        if finish_eventdate == None:
            raise ValueError("Parameter 'finish_eventdate' must have a value.")
        if reportlocations == None:
            raise ValueError("Parameter 'reportlocations' must have a value.")
        if diseases == None:
            raise ValueError("Parameter 'diseases' must have a value.")
        if syndromes == None:
            raise ValueError("Parameter 'syndromes' must have a value.")

        # assign variables
        self.article = article
        self.start_eventdate = (
            start_eventdate  # this should automatically set self.start_eventdate_id
        )
        self.finish_eventdate = (
            finish_eventdate  # this should automatically set self.finish_eventdate_id
        )
        self.reportlocations = reportlocations

        # check if they provided a list of diseases by name
        if type(diseases) == list and len(diseases) > 0 and type(diseases[0]) == str:
            self.diseases = [Disease(name=dname) for dname in diseases]
        elif (
            type(diseases) == list
            and len(diseases) > 0
            and type(diseases[0]) == Disease
        ):
            self.diseases = diseases
        elif type(diseases) == list and len(diseases) == 0:
            self.syndromes = []
        else:
            raise ValueError(
                f"diseases must be a list of disease names or Disease objects but recieved {diseases} of type {type(diseases)}."
            )

        for disease in self.diseases:
            self.reportdiseases.append(ReportDisease(disease_id=disease.id))

        # check if they provided a list of syndromes by name
        if type(syndromes) == list and len(syndromes) > 0 and type(syndromes[0]) == str:
            self.syndromes = [Syndrome(name=sname) for sname in syndromes]
        elif (
            type(syndromes) == list
            and len(syndromes) > 0
            and type(syndromes[0]) == Syndrome
        ):
            self.syndromes = syndromes
        elif type(syndromes) == list and len(syndromes) == 0:
            self.syndromes = []
        else:
            raise ValueError(
                f"syndromes must be a list of disease names or Syndrome objects but recieved {syndromes} of type {type(syndromes)}."
            )

        for syndrome in self.syndromes:
            self.reportsyndromes.append(ReportSyndrome(syndrome_id=syndrome.id))

    def __repr__(self):
        return f"<Report(id={self.id}, article_id={self.article_id}, start_eventdate_id={self.start_eventdate_id}, finish_eventdate_id={self.finish_eventdate_id})>"


class ReportLocation(Base):
    __tablename__ = "ReportLocations"
    id = Column(
        "id", Integer, nullable=False, unique=True, autoincrement=True, primary_key=True
    )
    geonames_id = Column("geonames_id", String, nullable=False)
    report_id = Column("report_id", ForeignKey("Reports.id"), nullable=False)

    # from
    report = relationship("Report", back_populates="reportlocations")

    def __repr__(self):
        return f"<ReportLocation(id={self.id}, geonames_id={self.geonames_id}, report_id={self.report_id})>"
